from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import *

urlpatterns = [
    #auth
    path('token/', MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path('token/refresh/', TokenRefreshView.as_view(), name="token_refresh"),
    path('user/create/', UserCreateApiView.as_view()),
    path('password-reset/', PasswordResetAPIView.as_view()),
    path('password-reset/confirm/', PasswordResetConfirmAPIView.as_view()),
    path('email-verification/', EmailVerificationAPIView.as_view()),
    path('email-verification/verify-otp/', OTPVerificationAPIView.as_view()),
    
    path('restaurants/', RestaurantListAPIView.as_view()),
    path('restaurants/<restaurant_uuid>', RestaurantAPIView.as_view()),
    path('restaurants/<restaurant_uuid>/discounts', RestaurantDiscountsAPIView.as_view()),
    path('restaurants/<restaurant_uuid>/menu_item_modifiers', MenuItemModifierAPIView.as_view()),
    
    path('orders/create', OrderCreateAPIView.as_view()),
    path('orders/<uuid>/update', OrderUpdateAPIView.as_view()),
    path('orders/<uuid>', OrderRetrieveAPIView.as_view()),
]
