import uuid
from django.db import migrations

def assign_uuid(apps, schema_editor):
    Restaurant = apps.get_model('api', 'Restaurant')
    for restaurant in Restaurant.objects.filter(uuid__isnull=True):
        restaurant.uuid = uuid.uuid4()
        restaurant.save()

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_restaurant_uuid'),
    ]

    operations = [
        migrations.RunPython(assign_uuid),
    ]
