# Generated by Django 5.1.5 on 2025-05-21 09:31

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0055_auto_20250521_1251'),
    ]

    operations = [
        migrations.AddField(
            model_name='menuitem',
            name='uuid',
            field=models.UUIDField(default=uuid.uuid4, editable=False, null=True),
        ),
    ]
