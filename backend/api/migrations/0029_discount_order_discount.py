# Generated by Django 5.1.5 on 2025-04-07 10:55

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0028_alter_orderitem_quantity'),
    ]

    operations = [
        migrations.CreateModel(
            name='Discount',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('valid_from', models.DateTimeField()),
                ('valid_to', models.DateTimeField()),
                ('discount_type', models.CharField(choices=[('percentage', 'Percentage'), ('fixed_amount', 'Fixed Amount'), ('free_delivery', 'Free Delivery')], default='percentage', max_length=25)),
                ('amount', models.IntegerField(default=0)),
                ('min_order_amount', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('restaurant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='discounts', to='api.restaurant')),
            ],
        ),
        migrations.AddField(
            model_name='order',
            name='discount',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='orders', to='api.discount'),
        ),
    ]
