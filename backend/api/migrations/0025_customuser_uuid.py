# Generated by Django 5.1.5 on 2025-04-04 10:05

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0024_remove_menuitem_category_menuitem_category'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='uuid',
            field=models.UUIDField(default=uuid.uuid4, editable=False, null=True),
        ),
    ]
