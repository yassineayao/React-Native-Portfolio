# Generated by Django 3.2.4 on 2021-10-30 10:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0013_remove_order_payement_mode'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='purchase_price',
            field=models.FloatField(default=0.0),
        ),
    ]
