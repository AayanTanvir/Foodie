from channels.generic.websocket import AsyncWebsocketConsumer
from api.models import Order, CustomUser
import json
from asgiref.sync import sync_to_async


@sync_to_async
def get_owner_and_check_group(owner_uuid):
    try:
        owner = CustomUser.objects.get(uuid=owner_uuid)
        return owner.groups.filter(name='restaurant owner').exists()
    except CustomUser.DoesNotExist:
        print('user does not exist')
        return False

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
        
        
class IncomingPendingOrderConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        owner_uuid = self.scope['url_route']['kwargs']['owner_uuid']
        
        self.group_name = f'incoming_pending_{owner_uuid}'
        await self.channel_layer.group_add(
            self.group_name, self.channel_name
        )
        
        if await get_owner_and_check_group(owner_uuid):
            await self.accept()
        else:
            await self.close()
            
    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.group_name, self.channel_name
        )
        
    async def send_incoming(self, event):
        await self.send(text_data=json.dumps(event['order']))


class IncomingActiveOrderConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        owner_uuid = self.scope['url_route']['kwargs']['owner_uuid']
        
        self.group_name = f'incoming_active_{owner_uuid}'
        await self.channel_layer.group_add(
            self.group_name, self.channel_name
        )
        
        if await get_owner_and_check_group(owner_uuid):
            await self.accept()
        else:
            await self.close()
            
    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.group_name, self.channel_name
        )
        
    async def send_incoming(self, event):
        await self.send(text_data=json.dumps(event['order']))