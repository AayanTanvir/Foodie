from celery import shared_task
from .models import Order
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


@shared_task
def complete_order(order_uuid):
    try:
        order = Order.objects.get(uuid=order_uuid)
        order.order_status = Order.OrderStatus.COMPLETED
        order.save()
        
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"order_{order_uuid}",
            {
                'type': 'order_status_update',
            }
        )
    except Order.DoesNotExist:
        pass