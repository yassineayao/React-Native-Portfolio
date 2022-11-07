"""
  File: admin.py
  Description: Register models to display in the admin panel
"""

from django.contrib import admin
from . import models

from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model
from django.utils.translation import gettext as _


class AccountAdmin(UserAdmin):
    """
    Define whitch user fields to display in the admin panel
    """

    ordering = ["id"]
    list_display = ["phone"]
    readonly_fields = ("date_joined", "last_login")
    fieldsets = (
        (_("User Details"), {"fields": ("username", "password")}),
        (_("Account Details"), {"fields": ("date_joined", "last_login")}),
        (_("Permission"), {"fields": ("is_active", "is_client", "is_distributor")}),
    )
    add_fieldsets = (
        (
            "User Details",
            {"fields": ("username", "phone", "email", "password1", "password2")},
        ),
        ("Permission", {"fields": ("is_active", "is_client", "is_distributor")}),
    )


admin.site.register(get_user_model(), AccountAdmin)

admin.site.register(models.Client)
admin.site.register(models.Distributor)
admin.site.register(models.Product)
admin.site.register(models.ProductState)
admin.site.register(models.History)
admin.site.register(models.BannedClient)
admin.site.register(models.Favorite)
admin.site.register(models.Category)
admin.site.register(models.Family)
admin.site.register(models.CanceledOrder)
admin.site.register(models.Promotion)
admin.site.register(models.Reclamation)


class OrderAdmin(admin.ModelAdmin):
    """
    Cutomize the representation of the orders in the admin panel.
    """

    # ? Set the read only fields
    readonly_fields = ("created_at", "updated_at")


admin.site.register(models.Order, OrderAdmin)
