from channels.generic.websocket import AsyncWebsocketConsumer
from api.models import Order
from django.core.cache import cache
from asgiref.sync import async_to_sync
import json


class OrderStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        order_uuid = self.scope['url_route']['kwargs']['order_uuid']
        self.group_name = f'order_{order_uuid}'
        await self.channel_layer.group_add(
            self.group_name, self.channel_name
        )
        try:
            self.order = await Order.objects.aget(uuid=order_uuid)
            await self.accept()
        except Order.DoesNotExist:
            print("Order does not exist")
            await self.close()
            
    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.group_name, self.channel_name
        )
            
    async def send_order_status(self, event):
        await self.send(text_data=json.dumps({
            "order_status": event["order_status"],
        }))
        