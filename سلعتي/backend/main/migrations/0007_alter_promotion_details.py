# Generated by Django 3.2.4 on 2021-10-18 14:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0006_auto_20211018_1450'),
    ]

    operations = [
        migrations.AlterField(
            model_name='promotion',
            name='details',
            field=models.TextField(),
        ),
    ]
