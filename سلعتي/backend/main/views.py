"""
  File: views.py
  Description: contains views for listing database rows, and views for handling mobile requests.
"""

import json
from django.views.decorators.csrf import csrf_exempt
from django.db.models.query_utils import Q
from django.http.response import JsonResponse
from rest_framework import generics
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from asgiref.sync import sync_to_async

from main.helper import newNotification, removeNewNotification
from . import models
from . import serializers


class ClientListCreate(generics.ListCreateAPIView):
    queryset = models.Client.objects.all()
    serializer_class = serializers.ClientSerializer


class ClientInfo(generics.ListAPIView):
    serializer_class = serializers.ClientSerializer

    def get_queryset(self):
        return models.Client.objects.filter(phone=self.request.user)


class DistributorListCreate(generics.ListCreateAPIView):
    queryset = models.Distributor.objects.all()
    serializer_class = serializers.DistributorSerializer


class ProductStateListCreate(generics.ListCreateAPIView):
    queryset = models.ProductState.objects.filter(status=True)
    serializer_class = serializers.ProductStateSerializer

    authentication_classes = (
        SessionAuthentication,
        JSONWebTokenAuthentication,
    )
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        page = int(self.request.GET.get("page", 1))
        category_name = self.request.GET.get("category", None)
        family_name = self.request.GET.get("family", None)
        search = self.request.GET.get("search", None)
        step = 10
        start = page * step
        end = (page + 1) * step
        distributor = models.Distributor.objects.filter(user=self.request.user)
        result = None
        is_distributor = False
        if not distributor:
            distributor = None
        elif not category_name:
            distributor = distributor[0]
            is_distributor = self.request.user.is_distributor
        if is_distributor:
            result = models.ProductState.objects.filter(distributor=distributor)[:1000]
        else:
            client = models.Client.objects.get(user=self.request.user)
            banned = models.BannedClient.objects.filter(client=client)

            # List of distributors banne the client
            distributors = []
            for dist in banned:
                distributors.append(dist.distributor)

            # Check if search
            if not search or search == "null":
                if family_name:
                    result = models.ProductState.objects.filter(
                        ~Q(distributor__in=distributors),
                        family__name=family_name,
                        status=True,
                    )[start:end]
                if category_name:
                    result = models.ProductState.objects.filter(
                        ~Q(distributor__in=distributors),
                        family__category__name=category_name,
                        status=True,
                    )[start:end]
            else:
                limit = 100  # NOTE: max number of search result
                if family_name and family_name != "null":
                    result = models.ProductState.objects.filter(
                        ~Q(distributor__in=distributors),
                        family__name=family_name,
                        status=True,
                        product__name__contains=search,
                    )[:limit]
                if category_name and category_name != "null":
                    result = models.ProductState.objects.filter(
                        ~Q(distributor__in=distributors),
                        family__category__name=category_name,
                        status=True,
                        product__name__contains=search,
                    )[:limit]
        return result


class OrderListCreate(generics.ListCreateAPIView):
    serializer_class = serializers.OrderSerializer

    def get_queryset(self):
        # TODO: Lazy loading
        step = 200
        distributor = models.Distributor.objects.filter(user=self.request.user)
        if not distributor:
            distributor = None
        else:
            distributor = distributor[0]
        banned_clients = models.BannedClient.objects.filter(
            distributor=distributor
        ).values("client")

        # Remove the notification from Firebase
        removeNewNotification("addOrder", distributor.email)

        return models.Order.objects.filter(
            Q(distributor=distributor)
            & ~Q(client__in=banned_clients)
            & Q(validated=False)
        ).order_by("client")[:step]


class CanceledOrdersList(generics.ListAPIView):
    serializer_class = serializers.CancelOrdersSerializer

    def get_queryset(self):
        distributor = models.Distributor.objects.filter(user=self.request.user)
        if not distributor:
            distributor = None
        else:
            distributor = distributor[0]
        return models.CanceledOrder.objects.filter(distributor=distributor)


class BannedClientListCreate(generics.ListCreateAPIView):
    serializer_class = serializers.BannedClientSerializer

    def get_queryset(self):
        distributor = models.Distributor.objects.filter(user=self.request.user)
        if not distributor:
            distributor = None
        else:
            distributor = distributor[0]
        return models.BannedClient.objects.filter(distributor=distributor)


class FavoriteListeCreateDelete(generics.ListCreateAPIView, generics.DestroyAPIView):
    queryset = models.Favorite.objects.all()
    serializer_class = serializers.FavoriteSerializer

    def get_queryset(self):
        try:
            return models.Favorite.objects.filter(
                client=models.Client.objects.get(user=self.request.user)
            )
        except Exception as e:
            return None


class CategoryListCreate(generics.ListCreateAPIView):
    queryset = models.Category.objects.all()
    serializer_class = serializers.CategorySerializer

    def get_queryset(self):
        promotion = self.request.GET.get("promotion", None)
        if promotion == "true":
            return models.Category.objects.filter(num_promotion__gt=0)
        return super().get_queryset()


class FamilyListCreate(generics.ListCreateAPIView):
    # queryset = models.Family.objects.all()
    serializer_class = serializers.FamilySerializer

    authentication_classes = (
        SessionAuthentication,
        JSONWebTokenAuthentication,
    )
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        page = int(self.request.GET.get("page", 1))
        category_name = self.request.GET.get("category", None)
        search = self.request.GET.get("search", None)

        if not category_name and not search:
            return models.Family.objects.all()

        # FIXME: Adjast the step value
        step = 10
        start = page * step
        end = (page + 1) * step

        # Check if search
        if not search or search == "null":
            return models.Family.objects.filter(category__name=category_name)[start:end]
        else:
            return models.Family.objects.filter(name__contains=search)[:step]


class HistoryList(generics.ListAPIView):
    # queryset = models.History.objects.all()
    serializer_class = serializers.HistorySerializer

    def get_queryset(self):
        if self.request.user.is_client:
            return models.History.objects.filter(client__user=self.request.user)
        elif self.request.user.is_distributor:
            return models.History.objects.filter(distributor__user=self.request.user)


class PromotionList(generics.ListAPIView):
    queryset = models.Promotion.objects.all()
    serializer_class = serializers.PromotionSerializer

    def get_queryset(self):
        step = 10
        category_name = self.request.GET.get("category", None)
        if self.request.user.is_client and category_name:
            page = int(self.request.GET.get("page", 0))
            res = models.Promotion.objects.filter(
                product_state__family__category__name=category_name
            )[page : page + step]
            return res

        distributor = models.Distributor.objects.get(user=self.request.user)
        return models.Promotion.objects.filter(product_state__distributor=distributor)


class ReclamationList(generics.ListAPIView):
    serializer_class = serializers.ReclamationSerializer

    def get_queryset(self):
        distributor = models.Distributor.objects.get(user=self.request.user)
        return models.Reclamation.objects.filter(product_state__distributor=distributor)


@api_view(("POST",))
@authentication_classes((JSONWebTokenAuthentication,))
@permission_classes((IsAuthenticated,))
@csrf_exempt
def update_client(request):
    if request.body:
        data = json.loads(request.body)
        client = models.Client.objects.get(phone=request.user)

        # ? update city
        if data.get("city", None):
            client.city = data["city"]

        # ? update address
        if data.get("address", None):
            client.address = data["address"]

        # ? update position
        if data.get("position", None):
            client.geo_location = data["position"]

        # ? update username
        if data.get("username", None):
            client.user.username = data["username"]
            client.user.save()

        # ? update phone number
        if data.get("phone", None):
            client.phone = data["phone"]

        # ? update password
        if data.get("newPassword", None):
            oldPassword = data["oldPassword"]
            user = models.User.objects.get(phone=request.user)
            # ? Check the current password
            valide = user.check_password(oldPassword)
            if valide:
                newPassword = data["newPassword"]
                user.set_password(newPassword)
            else:
                return JsonResponse({"update": "Invalide old password"}, status=500)

        # ? save modifications
        client.save()

        return JsonResponse({"update": "Ok"}, status=200)
    return JsonResponse({"error": "Body is empty"}, status=500)


@sync_to_async
@authentication_classes((JSONWebTokenAuthentication,))
@permission_classes((IsAuthenticated,))
@csrf_exempt
def update_product(request):
    if request.body:
        data = json.loads(request.body)
        for d in data:
            productState = models.ProductState.objects.get(id=d["id"])
            productState.family = models.Family.objects.get(id=d["family"]["id"])
            productState.status = d["status"]
            productState.price = d["price"]
            productState.save()

            product = models.Product.objects.get(id=d["product"]["id"])
            product.name = d["product"]["name"]
            product.image = d["product"]["image"]
            product.key = d["product"]["key"]
            product.save()
        return JsonResponse({"update": "Ok"}, status=200)
    return JsonResponse({"error": "Body is empty"}, status=500)


@sync_to_async
@api_view(("POST",))
@authentication_classes((JSONWebTokenAuthentication,))
@permission_classes((IsAuthenticated,))
def add_orders(request):
    orders = json.loads(request.body)
    client = models.Client.objects.get(phone=request.user)
    products = []
    print("*" * 19)
    for order in orders:
        # ? Get the product_state object
        print(order)
        product_state = models.ProductState.objects.get(pk=order["product_id"])

        # ? Stock the product state objects
        products.append(product_state)

        if models.Order.objects.filter(
            product_state=product_state, client=client
        ).exists():
            # ? Update existing order
            models.Order.objects.filter(
                product_state=product_state, client=client
            ).update(quantity=order["quantity"], purchase_price=order["price"])
        else:
            models.Order(
                client=client,
                product_state=product_state,
                distributor=product_state.distributor,
                quantity=order["quantity"],
                purchase_price=order["price"],
            ).save()

        # ? Send notification to the distibutor
        newNotification("addOrder", product_state.distributor.email)
    print("*" * 19)

    # ? Delete canceled ordes
    models.Order.objects.filter(~Q(product_state__in=products), client=client).delete()

    return JsonResponse({})


@api_view(("GET",))
@authentication_classes((JSONWebTokenAuthentication,))
@permission_classes((IsAuthenticated,))
def get_order_changes(request):
    # Get client object
    invoice_json = {}
    invoice_id = request.GET.get("invoice_id", None)
    if invoice_id:
        histories = models.History.objects.filter(invoice_id=invoice_id)
        if histories:
            invoice_json = {
                "invoice": {
                    "id": invoice_id,
                    "created_at": histories[0].date,
                },
                "client": {
                    "name": histories[0].client.user.username,
                    "phone": histories[0].client.phone,
                },
                "order": [],
            }
            for history in histories:
                invoice_json["order"].append(
                    {
                        "distributor": {
                            "name": history.distributor.user.username,
                            "phone": history.distributor.user.phone,
                            "address": history.distributor.address,
                        },
                        "product": {
                            "product_id": history.product_state.id,
                            "name": history.product_state.product.name,
                            "quantity": history.quantity,
                            "purchase_price": history.purchase_price,
                            "price": history.product_state.price,
                        },
                    }
                )
    return JsonResponse(invoice_json)


@sync_to_async
@api_view(("POST",))
@authentication_classes((JSONWebTokenAuthentication,))
@permission_classes((IsAuthenticated,))
def add_reclamations(request):
    data = json.loads(request.body)

    # ? Save the reclamations in DB
    if data:
        product_state = models.ProductState.objects.get(id=data["product_id"])
        models.Reclamation(
            product_state=product_state,
            client=models.Client.objects.get(user=request.user),
            details=data["notification"],
        ).save()

        # ? Send notification to the Firebase
        newNotification("addReclamation", product_state.distributor.email)
    return JsonResponse({})
