from .models import Order, Notification, CustomUser
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


def send_notification(*args, **kwargs):
    user_uuid = kwargs.get('user_uuid')
    content = kwargs.get('content', "Undefined notification")

    if not user_uuid and args:
        user_uuid = args[0]
    if not content and len(args) > 1:
        content = args[1]

    if not user_uuid or not content:
        print("[Task] No user uuid or notification provided")
        return

    user = CustomUser.objects.get(uuid=user_uuid)
    notification = Notification.objects.create(user=user, content=content, is_read=False)

    channel_layer = get_channel_layer()
    if channel_layer:
        async_to_sync(channel_layer.group_send)(
            f"notifications_{user_uuid}", {
                "type": "send_notification",
                "notification": notification.serialize(),
            }
        )
    else:
        print("[Task] Channel layer not found")