# Generated by Django 5.1.5 on 2025-05-03 08:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0044_menuitemmodifier_is_multiselect'),
    ]

    operations = [
        migrations.AlterField(
            model_name='menuitemmodifier',
            name='is_multiselect',
            field=models.BooleanField(default=False),
        ),
    ]
