from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import Group
from .models import Order, CustomUser


@receiver(post_save, sender=Order)
def schedule_order_status_update(sender, instance, created, **kwargs):
    if created:
        instance.update_order_status()
        
@receiver(post_save, sender=CustomUser)
def add_customer_group(sender, instance, created, **kwargs):
    if created:
        group, _ = Group.objects.get_or_create(name="customer")
        instance.groups.add(group)