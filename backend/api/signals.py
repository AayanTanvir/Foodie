from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import Group
from .models import Order, CustomUser
from .serializers import OrderReadSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


@receiver(post_save, sender=Order)
def schedule_order_status_update(sender, instance, created, **kwargs):
    if created:
        instance.update_order_status()
        
@receiver(post_save, sender=CustomUser)
def add_customer_group(sender, instance, created, **kwargs):
    if created:
        group, _ = Group.objects.get_or_create(name="customer")
        instance.groups.add(group)
        
@receiver(post_save, sender=Order)
def send_incoming_orders(sender, instance, created, **kwargs):
    if created:
        owner_uuid = instance.restaurant.owner.uuid
        serialized_instance = OrderReadSerializer(instance).data
        
        channel_layer = get_channel_layer()
        if channel_layer:
            async_to_sync(channel_layer.group_send)(
                f"incoming_{owner_uuid}", {
                    "type": "send_incoming",
                    "order": serialized_instance,
                }
            )
        else:
            print("[task] Channel layer not found")