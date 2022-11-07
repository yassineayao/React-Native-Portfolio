'''
    File: urls.py
    Description: Contains the mapping of all paths that allow the navigation for the web
                 app.
'''

from django.urls import path

from . import views

app_name = 'frontend'

urlpatterns = [
    path('accounts/login/', views.account),
    path('accounts/sign_in/', views.sign_in),
    path('api/login/', views.account),
    path('accounts/logout/', views.log_out),
    path('accounts/session/', views.session),
    path('accounts/whoami/', views.whoami),

    # Paths to allow the web browsing
    path('', views.index),
    path('orders/', views.index),
    path('products/', views.index),
    path('clients/', views.index),
    path('clients/banned/', views.index),
    path('reclamations/', views.index),

    path('api/order/validate', views.validate_orders),
    path('api/order/cancel/', views.cancel_orders),

    path('api/clients/ban/', views.ban_clients),
    path('api/clients/white_list/', views.white_list_clients),

    path('api/promotions/add/', views.add_promotions),
    path('api/promotions/delete/', views.delete_promotions),

    path('api/reclamations/delete/', views.delete_reclamations),
]
