# Generated by Django 5.1.5 on 2025-05-21 09:32

from django.db import migrations, models 
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0057_auto_20250521_1432'),
    ]

    operations = [
        migrations.AlterField(
            model_name='menuitem',
            name='uuid',
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
    ]
