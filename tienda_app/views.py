from django import views
from django.shortcuts import render, redirect
from django.http.response import JsonResponse
from .models import Producto
from django.views import View


# Create your views here.

def inicio(request):
     
    return render(request, 'paginas/inicio.html')

def carrito(request):

    return render(request, 'paginas/carrito.html')

# def admin(request):

#     return render(request, 'paginas/admin.html')  

class Datos(View):

    def get (self, request):
        productos = list(Producto.objects.values())
        if len(productos) > 0:
            datos = {'message': "Success", 'productos': productos}
        else:
            datos = {'message': "Productos no encontrados"}
        
        return JsonResponse(datos)
