# Generated by Django 3.2.4 on 2022-01-31 12:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0021_auto_20220131_1201'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='productstate',
            name='prices',
        ),
        migrations.AddField(
            model_name='productstate',
            name='price',
            field=models.FloatField(default=0.0),
        ),
    ]
