from channels.generic.websocket import AsyncWebsocketConsumer
from api.models import *


class OrderStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        order_uuid = self.scope['url_route']['kwargs']['order_uuid']
        try:
            self.order = await Order.objects.get(uuid=order_uuid)
            self.accept()
            
        except Order.DoesNotExist:
            await self.close()

        self.accept()