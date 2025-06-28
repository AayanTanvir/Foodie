from django.urls import path
from .consumers import *


websocket_urlpatterns = [
    path('ws/orders/<uuid:order_uuid>/status/', OrderStatusConsumer.as_asgi()),
    path('ws/orders/<uuid:owner_uuid>/incoming/', IncomingOrdersConsumer.as_asgi()),
]