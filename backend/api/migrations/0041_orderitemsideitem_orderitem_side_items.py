# Generated by Django 5.1.5 on 2025-04-08 16:22

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0040_remove_orderitem_side_items_remove_sideitem_quantity'),
    ]

    operations = [
        migrations.CreateModel(
            name='OrderItemSideItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField(default=1)),
                ('order_item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.orderitem')),
                ('side_item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.sideitem')),
            ],
        ),
        migrations.AddField(
            model_name='orderitem',
            name='side_items',
            field=models.ManyToManyField(related_name='order_items', through='api.OrderItemSideItem', to='api.sideitem'),
        ),
    ]
