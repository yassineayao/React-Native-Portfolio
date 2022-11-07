"""
  File: urls.py
  Description: Contians a list of mapping url/view. This file contains only
               the rest_framework and the mobile app urls.
"""
from django.urls import path

from . import views

app_name = "main"

urlpatterns = [
    path("api/clients/", views.ClientListCreate.as_view()),
    path("api/clients/banned/", views.BannedClientListCreate.as_view()),
    path("api/clients/update/", views.update_client),
    path("api/client/", views.ClientInfo.as_view()),
    path("api/companys/", views.DistributorListCreate.as_view()),
    path("api/orders/", views.OrderListCreate.as_view()),
    path("api/orders/canceled/", views.CanceledOrdersList.as_view()),
    path("api/orders/add/", views.add_orders),
    path("api/orders/changes/", views.get_order_changes),
    path("api/products/", views.ProductStateListCreate.as_view()),
    path("api/products/update/", views.update_product),
    path("api/categories/", views.CategoryListCreate.as_view()),
    path("api/families/", views.FamilyListCreate.as_view()),
    path("api/history/", views.HistoryList.as_view()),
    path("api/promotions/", views.PromotionList.as_view()),
    path("api/reclamations/", views.ReclamationList.as_view()),
    path("api/reclamations/add/", views.add_reclamations),
]
