"""
  File: views.py
  Description: Contians all views that process the web app requests.
"""

from main.helper import newNotification, removeNewNotification, updateNotification
from django.http.response import JsonResponse
from django.shortcuts import render

from django.contrib.auth.decorators import login_required
from main.models import (
    BannedClient,
    CanceledOrder,
    Category,
    Client,
    Distributor,
    History,
    Order,
    Product,
    ProductState,
    Promotion,
    Reclamation,
)
import json

from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST

from asgiref.sync import sync_to_async


def updateNumPromotion():
    categories = Category.objects.all()
    for category in categories:
        num = ProductState.objects.filter(
            is_promoted=True, family__category=category
        ).__len__()
        category.num_promotion = num
        category.save()


@require_POST
def sign_in(request):
    # TODO: Replace this view by JWT auth
    if request.body:
        data = json.loads(request.body)
        username = data.get("username", None)
        password = data.get("password", None)

        if username is None or password is None:
            return JsonResponse(
                {"detail": "Please provide username and password."}, status=400
            )

        user = authenticate(username=username, password=password)

        if user is None or not user.is_distributor:
            return JsonResponse({"detail": "Invalid credentials."}, status=400)

        login(request, user)
        return JsonResponse({"detail": "Successfully logged in."})
    return JsonResponse({"detail": "Invalid credentials."}, status=400)


def log_out(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "You're not logged in."}, status=400)

    logout(request)
    return JsonResponse({"detail": "Successfully logged out."})


@ensure_csrf_cookie
def session(request):
    if not request.user.is_authenticated:
        return JsonResponse(
            {"isAuthenticated": False, "username": request.user.username}
        )

    return JsonResponse({"isAuthenticated": True, "username": request.user.phone})


def whoami(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isAuthenticated": False})
    return JsonResponse({"username": request.user.email})


@login_required(login_url="/accounts/login/")
def index(request):
    return render(request, "frontend/index.html")


def account(request):
    return render(request, "frontend/index.html")


@login_required(login_url="/accounts/login")
def validate_orders(request):
    """
    URL: 'api/order/validate'
    """
    clients_ids = json.loads(request.body).get("ids")
    invoice_id = json.loads(request.body).get("invoiceId")
    distributor = Distributor.objects.get(user=request.user)
    for client_id in clients_ids:
        history = []
        client = Client.objects.get(user_id=client_id)
        orders = Order.objects.filter(client=client, distributor=distributor)

        # ? Send notification to the client
        updateNotification(
            "updateOrder",
            client.user.phone,
            {
                "message": "يتم تجهيز طلبكم.",
                "invoice_id": invoice_id,
                "image": "https://abclive1.s3.amazonaws.com/95076277-3055-4b50-9221-7d58b97f4614/widgetgraphic/delivery-driver.jpg",
            },
        )

        # ? Move orders to the History table
        for order in orders:
            history.append(
                History(
                    invoice_id=invoice_id,
                    client=client,
                    distributor=distributor,
                    product_state=order.product_state,
                    quantity=order.quantity,
                    purchase_price=order.purchase_price,
                )
            )
        History.objects.bulk_create(history)
        orders.delete()

    return JsonResponse({"details": "Successfully validated"})


@login_required(login_url="/accounts/login")
def cancel_orders(request):
    """
    URL: 'api/order/cancel/'
    """
    data = json.loads(request.body)
    clients = data["clients"]
    notification = data["notification"]
    distributor = Distributor.objects.get(email=request.user)
    canceled = []

    # ? Save canceled orders
    for client in clients:
        client_ = Client.objects.get(phone=client["phone"])
        for order in client["orders"]:
            canceled.append(
                CanceledOrder(
                    client=client_,
                    distributor=distributor,
                    product=Product.objects.get(key=order["key"]),
                    notification=notification,
                )
            )
    CanceledOrder.objects.bulk_create(canceled)

    # ? Send notification to the client
    if notification:
        message = f"لقد تم الغاء طلبكم لاسباب التالية: {notification}"
    else:
        message = f"لقد تم الغاء طلبكم للاسباب لم يصرح بها المورد"
    updateNotification("updateOrder", client["phone"], {"message": message})

    return JsonResponse({"details": "Successfully canceled"})


@login_required(login_url="/accounts/login")
def ban_clients(request):
    """
    URL: api/clients/ban/
    """
    data = json.loads(request.body)
    clients = data["clients"]
    notification = data["notification"]
    distributor = Distributor.objects.get(email=request.user)
    banned = []

    # ? Add clients to the ban table
    for client in clients:
        banned.append(
            BannedClient(
                client=Client.objects.get(phone=client),
                distributor=distributor,
                notification=notification,
            )
        )
    BannedClient.objects.bulk_create(banned)

    return JsonResponse({"details": "Successfully banned"})


@login_required(login_url="/accounts/login")
def white_list_clients(request):
    """
    URL: 'api/clients/white_list/'
    """
    clients = json.loads(request.body)
    distributor = Distributor.objects.get(email=request.user)
    clients = Client.objects.filter(phone__in=clients)

    # ? Remove clients from the ban table
    BannedClient.objects.filter(distributor=distributor, client__in=clients).delete()

    return JsonResponse({"details": "Successfully banned"})


@sync_to_async
@login_required(login_url="/accounts/login")
def add_promotions(request):
    """
    URL: api/promotions/add/
    """
    promos = json.loads(request.body)
    products = ProductState.objects.filter(id__in=promos["products"])

    # ? Separate the new promotions and the promotions to update
    to_update = []
    promotions = []
    for product in products:
        if product.is_promoted:
            to_update.append(product)
        else:
            promotions.append(
                Promotion(
                    product_state=product,
                    title=promos["title"],
                    details=promos["details"],
                )
            )

    # ? Create the new promotions
    Promotion.objects.bulk_create(promotions)

    # ? Update the existing promotions
    Promotion.objects.filter(product_state__in=to_update).update(
        title=promos["title"], details=promos["details"]
    )

    # ? Mark product to be promoted
    products.update(is_promoted=True)

    # ? Update categories num_promotion
    updateNumPromotion()

    # ? Send notification to the Firebase
    newNotification(
        parent="promotions",
        data={
            "message": promos["details"],
            "title": promos["title"],
            "image": products[0].product.image,
        },
    )

    return JsonResponse({})


@sync_to_async
@login_required(login_url="/accounts/login")
def delete_promotions(request):
    """
    URL: 'api/promotions/delete/'
    """
    promos = json.loads(request.body)
    products = ProductState.objects.filter(id__in=promos["products"])

    # ? Mark products to be unpromoted
    products.update(is_promoted=False)

    # ? Delete promotions
    Promotion.objects.filter(product_state__in=products).delete()

    # ? Update category num_promotion
    updateNumPromotion()

    return JsonResponse({})


@sync_to_async
@login_required(login_url="/accounts/login")
def delete_reclamations(request):
    """
    URL: 'api/reclamations/delete/'
    """
    ids = json.loads(request.body)
    reclamations = Reclamation.objects.filter(id__in=ids)
    # ? get username then delete reclamations
    if len(reclamations) > 0:
        username = reclamations[0].product_state.distributor.email
        reclamations.delete()
        # ? Remove the notification from the Firebase.
        removeNewNotification("addReclamation", username)
    return JsonResponse({})
