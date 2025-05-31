from channels.generic.websocket import AsyncWebsocketConsumer
from api.models import *
from django.core.cache import cache
import json


class OrderStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        order_uuid = self.scope['url_route']['kwargs']['order_uuid']
        self.group_name = f'order_{order_uuid}'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        try:
            self.order = await Order.objects.aget(uuid=order_uuid)
            await self.accept()
            await self.send_order_status()
        except Order.DoesNotExist:
            await self.close()
            
    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)        
            
    async def send_order_status(self):
        await self.send(text_data=json.dumps({
            "order_uuid": str(self.order.uuid),
            "status": self.order.order_status,
        }))
        
    async def order_status_update(self, event):
        await self.send_order_status()
        