# Generated by Django 5.1.5 on 2025-04-08 16:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0038_alter_sideitem_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='sideitem',
            name='quantity',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
    ]
