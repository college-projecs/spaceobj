# Generated by Django 5.1.7 on 2025-03-17 15:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spaceapp', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='planets',
            old_name='size',
            new_name='mass',
        ),
        migrations.AddField(
            model_name='planets',
            name='distance',
            field=models.FloatField(default=56),
            preserve_default=False,
        ),
    ]
