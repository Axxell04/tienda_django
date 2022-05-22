# Generated by Django 4.0.3 on 2022-05-20 03:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tienda_app', '0012_alter_pedido_celular'),
    ]

    operations = [
        migrations.CreateModel(
            name='Cuentas',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('costos', models.DecimalField(decimal_places=2, default=0, max_digits=10, verbose_name='Costos')),
                ('fecha', models.CharField(max_length=60, null=True, verbose_name='Fecha')),
            ],
        ),
    ]