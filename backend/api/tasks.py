from .models import Order
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


def complete_order(*args, **kwargs):
    order_uuid = kwargs.get('order_uuid')
    if not order_uuid and args:
        order_uuid = args[0]

    if not order_uuid:
        print("[task] No order_uuid provided!")
        return
    
    try:
        order = Order.objects.get(uuid=order_uuid)
        order.order_status = Order.OrderStatus.COMPLETED
        order.save()
        
        channel_layer = get_channel_layer()
        if channel_layer:
            async_to_sync(channel_layer.group_send)(
                f"order_{order_uuid}", {
                    "type": "send_order_status",
                    "order_status": order.order_status
                }
            )
        else:
            print("[task] Channel layer not found")
    except Order.DoesNotExist:
        print('[task] Order does not exist')
        pass