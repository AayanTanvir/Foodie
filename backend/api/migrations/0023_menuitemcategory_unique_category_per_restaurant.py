# Generated by Django 5.1.5 on 2025-03-26 10:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0022_menuitemcategory_menuitem_category'),
    ]

    operations = [
        migrations.AddConstraint(
            model_name='menuitemcategory',
            constraint=models.UniqueConstraint(fields=('name', 'restaurant'), name='unique_category_per_restaurant'),
        ),
    ]
