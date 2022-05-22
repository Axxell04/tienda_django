from django.db import models

# Create your models here.
class Producto(models.Model):
    id=models.AutoField(primary_key=True)
    nombre=models.CharField(max_length=100, verbose_name='Nombre')
    imagen=models.ImageField(upload_to='imagenes/', verbose_name='Imagen', null=True)
    descripcion=models.TextField(verbose_name='Descripción', null=True)
    precio=models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Precio', default=0)
    stock=models.IntegerField(verbose_name='Stock', default=1)
    colores=models.CharField(max_length=100, verbose_name='Colores', null=True)
    estado=models.CharField(max_length=20, verbose_name='Estado', default='Nuevo', null=True)
    categoria=models.CharField(max_length=20, verbose_name='Categoría', default='Nuevos')

    def __str__(self):
        datos = 'Nombre: ' + self.nombre + " - " + 'Descripción: ' + self.descripcion
        return datos
        
    def updateImg(self, using=None, keep_parents=False):
        self.imagen.storage.delete(self.imagen.name)

    def delete(self, using=None, keep_parents=False):
        self.imagen.storage.delete(self.imagen.name)
        super().delete()
    
        
    
class Pedido(models.Model):
    id=models.AutoField(primary_key=True)
    cantidadProducto=models.IntegerField(verbose_name='Cantidad de productos', null=True)
    precioTotal=models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Precio Total', default=0)
    nombre=models.CharField(max_length=40, verbose_name='Nombre', null=True)
    # celular=models.IntegerField(verbose_name='Celular', null=True)
    celular=models.CharField(max_length=10, verbose_name='Celular', null=True)
    datosProducto=models.TextField(verbose_name='Datos del producto', null=True)
    fecha=models.CharField(max_length=60, verbose_name='Fecha', null=True)
    estado=models.CharField(default='Pendiente', max_length=20)

    def __str__(self):
        celular = str(self.celular)
        cantidadP = str(self.cantidadProducto)
        precioT = str(self.precioTotal)

        datos = 'Nombre:' + self.nombre + " - " + 'Celular: ' + celular + " - " + 'Datos del producto: ' + self.datosProducto + " - " + 'Cantidad de productos: ' + cantidadP + " - " + 'Precio total: ' + precioT + " - " + 'Fecha: ' + str(self.fecha) + " - " + 'Estado: ' + self.estado

        return datos

    def ganancias(self):
        return self.precioTotal

class Costos(models.Model):
    id=models.AutoField(primary_key=True)
    valor=models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Costos', default=0)
    fecha=models.CharField(max_length=60, verbose_name='Fecha', null=True)
    detalles=models.TextField(verbose_name='Detalles', null=True)
