# Generated by Django 3.2.4 on 2021-11-01 08:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0015_alter_history_purchase_price'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='num_promotion',
            field=models.IntegerField(default=0),
        ),
    ]
