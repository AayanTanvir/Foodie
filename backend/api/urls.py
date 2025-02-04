from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import (TokenRefreshView)
from .serializers import MyTokenObtainPairView


urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path('token/refresh/', TokenRefreshView.as_view(), name="token_refresh"),
]
