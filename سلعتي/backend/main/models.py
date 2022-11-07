"""
  File: models.py
  Description: Define models used to generate and manage the database
"""

from django.contrib.auth.models import AbstractUser
from django.db import models

from django.utils.timezone import now


class User(AbstractUser):
    username = models.CharField(max_length=200)
    phone = models.CharField(max_length=60, unique=True)
    date_joined = models.DateTimeField(verbose_name="Date joined", auto_now_add=True)
    last_login = models.DateTimeField(verbose_name="Last login", auto_now=True)
    is_client = models.BooleanField(default=False)
    is_distributor = models.BooleanField(default=False)
    USERNAME_FIELD = "phone"
    REQUIRED_FIELDS = ["username"]

    def create_user(
        self, username, phone="", password=None, is_distributor=False, is_client=False
    ):
        """
        Creates and saves a new user
        """
        self.username = username
        self.phone = phone
        self.is_distributor = is_distributor
        self.is_client = is_client
        self.set_password(password)
        self.save()
        return self


class Client(models.Model):
    user = models.OneToOneField(User, primary_key=True, on_delete=models.CASCADE)
    phone = models.CharField(max_length=60, unique=True)
    address = models.CharField(max_length=200, default="address")
    city = models.CharField(max_length=200, default="city")
    geo_location = models.JSONField()

    def __str__(self):
        return self.phone


class Distributor(models.Model):
    user = models.OneToOneField(User, primary_key=True, on_delete=models.CASCADE)
    email = models.EmailField(max_length=60, unique=True)
    address = models.CharField(max_length=200)
    region = models.CharField(max_length=200)

    def __str__(self) -> str:
        return self.email


class Category(models.Model):
    name = models.CharField(max_length=200, unique=True)
    image = models.URLField(blank=True)
    num_promotion = models.IntegerField(default=0)

    def __str__(self) -> str:
        return self.name


class Family(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    name = models.CharField(max_length=200, unique=True)
    image = models.URLField(blank=True)

    def __str__(self) -> str:
        return self.name


class Product(models.Model):
    key = models.CharField(max_length=200, unique=True)
    name = models.CharField(max_length=200)
    image = models.URLField(blank=True)

    def __str__(self) -> str:
        return self.name


class ProductState(models.Model):
    distributor = models.ForeignKey(Distributor, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    family = models.ForeignKey(Family, on_delete=models.SET_NULL, null=True)
    price = models.FloatField(default=0.0)
    status = models.BooleanField(default=True)
    is_promoted = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"{self.id}-{self.product.__str__()}"


class Favorite(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    product_state = models.ForeignKey(ProductState, on_delete=models.CASCADE)

    class Meta:
        unique_together = (
            "client",
            "product_state",
        )

    def __str__(self) -> str:
        return self.client.__str__()


class Order(models.Model):
    order_id = models.CharField(max_length=200, default="")
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    distributor = models.ForeignKey(Distributor, on_delete=models.CASCADE)
    product_state = models.ForeignKey(ProductState, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    purchase_price = models.FloatField(default=0.0)
    validated = models.BooleanField(default=False)
    created_at = models.DateTimeField(
        verbose_name="Created At",
        auto_now_add=True,
    )
    updated_at = models.DateTimeField(verbose_name="Updated At", auto_now=True)

    def __str__(self) -> str:
        return f"{self.quantity} - {self.product_state.__str__()}"


class BannedClient(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    distributor = models.ForeignKey(Distributor, on_delete=models.CASCADE)
    notification = models.CharField(max_length=250, default="")
    date = models.DateField(default=now)

    def __str__(self) -> str:
        return f"{self.distributor.__str__()}--{self.client.__str__()}"


class CanceledOrder(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    distributor = models.ForeignKey(Distributor, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    notification = models.CharField(max_length=250, default="")
    date = models.DateField(default=now)

    def __str__(self) -> str:
        return f"{self.distributor.__str__()}--{self.client.__str__()}"


class History(models.Model):
    invoice_id = models.CharField(max_length=200)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    distributor = models.ForeignKey(Distributor, on_delete=models.CASCADE)
    product_state = models.ForeignKey(ProductState, on_delete=models.CASCADE)
    date = models.DateField(default=now)
    quantity = models.PositiveIntegerField()
    purchase_price = models.FloatField(default=0.0)


class Promotion(models.Model):
    product_state = models.ForeignKey(ProductState, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    details = models.TextField()


class Reclamation(models.Model):
    product_state = models.ForeignKey(ProductState, on_delete=models.CASCADE)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    details = models.TextField()
