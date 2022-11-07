"""
  File: serializers.py
  Description: Contains each model serializer whitch defined how to transform a model
               into a JSON model
"""
from rest_framework import serializers

from . import models


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = (
            "id",
            "username",
        )
        managed = True
        verbose_name = "User"
        verbose_name_plural = "User"


class ClientSerializer(serializers.ModelSerializer):
    # ? Use the userSerializer to present the user
    user = UserSerializer(read_only=True)
    """
    Note: By default the serializer use the id to present the foriegnKey objects.
          We use the foriegnKey serializer to force exporting the foriegnkey object values.
    Exemple: We use UserSerializer above to force exporting the full user info.

  """

    class Meta:
        model = models.Client
        fields = "__all__"
        managed = True
        verbose_name = "Client"
        verbose_name_plural = "Client"


class DistributorSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Distributor
        fields = "__all__"
        managed = True
        verbose_name = "Distributor"
        verbose_name_plural = "Distributors"


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = "__all__"
        managed = True
        verbose_name = "Category"
        verbose_name_plural = "Categories"


class FamilySerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = models.Family
        fields = "__all__"
        managed = True
        verbose_name = "Family"
        verbose_name_plural = "Families"


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Product
        fields = "__all__"
        managed = True
        verbose_name = "Client"
        verbose_name_plural = "Client"


class ProductStateSerializer(serializers.ModelSerializer):
    distributor = DistributorSerializer(read_only=True)
    product = ProductSerializer(read_only=True)
    family = FamilySerializer(read_only=True)

    class Meta:
        model = models.ProductState
        fields = "__all__"
        managed = True
        verbose_name = "Client"
        verbose_name_plural = "Client"


class OrderSerializer(serializers.ModelSerializer):
    product_state = ProductStateSerializer(read_only=True)
    client = ClientSerializer(read_only=True)

    class Meta:
        model = models.Order
        fields = "__all__"
        managed = True
        verbose_name = "Order"
        verbose_name_plural = "Orders"


class CancelOrdersSerializer(serializers.ModelSerializer):
    client = ClientSerializer(read_only=True)
    product = ProductStateSerializer(read_only=True)

    class Meta:
        model = models.CanceledOrder
        fields = "__all__"
        managed = True
        verbose_name = "Canceled order"
        verbose_name_plural = "Canceled orders"


class BannedClientSerializer(serializers.ModelSerializer):
    distributor = DistributorSerializer(read_only=True)
    client = ClientSerializer(read_only=True)

    class Meta:
        model = models.BannedClient
        fields = "__all__"
        managed = True
        verbose_name = "Client"
        verbose_name_plural = "Clients"


class FavoriteSerializer(serializers.ModelSerializer):
    product_state = ProductStateSerializer(read_only=True)

    class Meta:
        model = models.Favorite
        fields = "__all__"
        managed = True
        verbose_name = "Favorite"
        verbose_name_plural = "Favorites"


class HistorySerializer(serializers.ModelSerializer):
    # product_state = ProductStateSerializer(read_only=True)
    client = ClientSerializer(read_only=True)

    class Meta:
        model = models.History
        # fields = "__all__"
        fields = ("date", "purchase_price", "client")
        managed = True
        verbose_name = "History"
        verbose_name_plural = "Histories"


class PromotionSerializer(serializers.ModelSerializer):
    product_state = ProductStateSerializer(read_only=True)

    class Meta:
        model = models.Promotion
        fields = "__all__"
        managed = True
        verbose_name = "Promotion"
        verbose_name_plural = "Promotions"


class ReclamationSerializer(serializers.ModelSerializer):
    product_state = ProductStateSerializer(read_only=True)
    client = ClientSerializer(read_only=True)

    class Meta:
        model = models.Reclamation
        fields = "__all__"
        managed = True
        verbose_name = "Reclamation"
        verbose_name_plural = "Reclamations"
