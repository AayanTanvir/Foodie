# Generated by Django 5.1.5 on 2025-03-11 11:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_discount_restaurantcategory_menuitemcategory_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='restaurant',
            name='discounts',
        ),
    ]
