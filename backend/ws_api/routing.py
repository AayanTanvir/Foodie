from django.urls import path
from .consumers import *


websocket_urlpatterns = [
    path('ws/orders/<uuid:order_uuid>/status', OrderStatusConsumer.as_asgi()),
]