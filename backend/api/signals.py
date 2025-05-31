from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order

@receiver(post_save, sender=Order)
def schedule_order_status_update(sender, instance, created, **kwargs):
    if created:
        instance.update_order_status()