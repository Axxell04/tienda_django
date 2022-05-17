# Generated by Django 4.0.3 on 2022-03-21 21:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tienda_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='producto',
            name='colores',
            field=models.CharField(max_length=100, null=True, verbose_name='Colores'),
        ),
        migrations.AddField(
            model_name='producto',
            name='estado',
            field=models.IntegerField(choices=[(1, 'Nuevo'), (2, 'Usado')], default=1),
        ),
        migrations.AddField(
            model_name='producto',
            name='notas',
            field=models.TextField(null=True, verbose_name='Notas'),
        ),
        migrations.AddField(
            model_name='producto',
            name='precio',
            field=models.IntegerField(default=0, verbose_name='Precio'),
        ),
        migrations.AddField(
            model_name='producto',
            name='stock',
            field=models.IntegerField(default=1, verbose_name='Stock'),
        ),
    ]
