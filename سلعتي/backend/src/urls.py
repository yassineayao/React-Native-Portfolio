'''
  File: urls.py
  Description: contains the navigation paths to navigate between project apps.
'''

from django.conf import settings
from django.contrib import admin
from django.urls import path, include

from django.conf.urls.static import static

from django.conf.urls import url
from rest_framework_jwt.views import obtain_jwt_token
from rest_framework_jwt.views import refresh_jwt_token
from rest_framework_jwt.views import verify_jwt_token


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('main.urls', namespace='main')),
    path('', include('frontend.urls', namespace='frontend')),

    url(r'^auth-jwt/', obtain_jwt_token),
    url(r'^auth-jwt-refresh/', refresh_jwt_token),
    url(r'^auth-jwt-verify/', verify_jwt_token),
] + static(settings.STATIC_URL)
