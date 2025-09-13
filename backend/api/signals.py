from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import Group
from django_q.tasks import async_task
from .models import Order, CustomUser
from .serializers import OrderReadSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


@receiver(post_save, sender=Order)
def schedule_order_status_complete(sender, instance, created, **kwargs):
    if not created and instance.order_status == Order.OrderStatus.OUT_FOR_DELIVERY:
        #instance.complete_order_status_scheduled(seconds=10)
        instance.complete_order_status_scheduled(schedule_randomly=True)

@receiver(post_save, sender=Order)
def send_order_status_ws(sender, instance, created, **kwargs):
    if not created:
        async_task("api.tasks.send_order_status", order_uuid=str(instance.uuid), save=False)
        
        if instance.order_status != Order.OrderStatus.PENDING:
            content = ""
            if (
                instance.order_status == Order.OrderStatus.DECLINED 
                or instance.order_status == Order.OrderStatus.CANCELLED
                or instance.order_status == Order.OrderStatus.DELIVERED
            ):
                content = f"Your order at {instance.restaurant.name.capitalize()} has been {instance.order_status.lower()}."
            elif (instance.order_status == Order.OrderStatus.PREPARING):
                content = f"Your order at {instance.restaurant.name.capitalize()} is being prepared."
            elif (instance.order_status == Order.OrderStatus.OUT_FOR_DELIVERY):
                content = f"Your order at {instance.restaurant.name.capitalize()} is out for delivery."

            async_task("api.tasks.send_notification", user_uuid=str(instance.user.uuid), content=content, save=False)

@receiver(post_save, sender=CustomUser)
def add_customer_group(sender, instance, created, **kwargs):
    if created:
        group, _ = Group.objects.get_or_create(name="customer")
        instance.groups.add(group)
        
@receiver(post_save, sender=Order)
def send_incoming_pending_orders(sender, instance, created, **kwargs):
    if created:
        owner_uuid = instance.restaurant.owner.uuid
        serialized_instance = OrderReadSerializer(instance).data
        
        channel_layer = get_channel_layer()
        if channel_layer:
            async_to_sync(channel_layer.group_send)(
                f"incoming_pending_{owner_uuid}", {
                    "type": "send_incoming",
                    "order": serialized_instance,
                }
            )
        else:
            print("[Signal] Channel layer not found")
    
        async_task("api.tasks.send_notification", user_uuid=str(instance.restaurant.owner.uuid), content="You have new pending orders!", save=False)

@receiver(post_save, sender=Order)
def send_incoming_active_orders(sender, instance, created, **kwargs):
    if (
        not created
        and instance.order_status in [
            Order.OrderStatus.PREPARING,
            Order.OrderStatus.OUT_FOR_DELIVERY,
        ]
    ):

        owner_uuid = instance.restaurant.owner.uuid
        serialized_instance = OrderReadSerializer(instance).data
        
        channel_layer = get_channel_layer()
        if channel_layer:
            async_to_sync(channel_layer.group_send)(
                f"incoming_active_{owner_uuid}", {
                    "type": "send_incoming",
                    "order": serialized_instance,
                }
            )
        else:
            print("[Signal] Channel layer not found")
    