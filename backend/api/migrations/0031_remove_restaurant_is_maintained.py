# Generated by Django 5.1.5 on 2025-04-07 12:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0030_alter_orderitem_menu_item'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='restaurant',
            name='is_maintained',
        ),
    ]
