# Generated by Django 5.1.5 on 2025-05-14 10:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0047_order_delivery_address'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='delivery_address',
            field=models.TextField(default='123'),
            preserve_default=False,
        ),
    ]
