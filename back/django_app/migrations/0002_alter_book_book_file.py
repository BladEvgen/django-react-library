# Generated by Django 5.0.2 on 2024-02-17 07:46

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('django_app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='book',
            name='book_file',
            field=models.FileField(blank=True, default=None, null=True, upload_to='books/', validators=[django.core.validators.FileExtensionValidator(['jpeg', 'jpg', 'png'])], verbose_name='Book file'),
        ),
    ]