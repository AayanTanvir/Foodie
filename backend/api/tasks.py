from .models import Order
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


def complete_order(*args, **kwargs):
    order_uuid = kwargs.get('order_uuid')
    if not order_uuid and args:
        order_uuid = args[0]

    if not order_uuid:
        print("[Task] No order uuid provided")
        return
    
    try:
        order = Order.objects.get(uuid=order_uuid)
        order.change_order_status("delivered")
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
            print("[Task] Channel layer not found")

    except Order.DoesNotExist:
        print(f"[Task] Order does not exist for uuid: {order_uuid}")
        return


def send_order_status(*args, **kwargs):
    order_uuid = kwargs.get('order_uuid')
    if not order_uuid and args:
        order_uuid = args[0]

    if not order_uuid:
        print("[Task] No order uuid provided")
        return
    
    try:
        order = Order.objects.get(uuid=order_uuid)
        
        channel_layer = get_channel_layer()
        if channel_layer:
            async_to_sync(channel_layer.group_send)(
                f"order_{order_uuid}", {
                    "type": "send_order_status",
                    "order_status": order.order_status
                }
            )
        else:
            print("[Task] Channel layer not found")

    except Order.DoesNotExist:
        print(f"[Task] Order does not exist for uuid: {order_uuid}")
        return