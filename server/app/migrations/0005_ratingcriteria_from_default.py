# Generated by Django 3.2.8 on 2022-06-06 13:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_defaultratingcriteria'),
    ]

    operations = [
        migrations.AddField(
            model_name='ratingcriteria',
            name='from_default',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
    ]
