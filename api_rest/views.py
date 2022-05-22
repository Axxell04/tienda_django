import numbers
import json

from django.shortcuts import render
from django.http import HttpResponseNotAllowed, HttpResponseForbidden, HttpResponseRedirect
from django.views import View
from django.http.response import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from admin_tienda.views import productos
from tienda_app.models import Producto
from tienda_app.models import Pedido
from tienda_app.models import Costos

# Create your views here.
""" +++++++++++++++++ CLIENTE +++++++++++++++++++++++++++++ """


def pintar_productos(request, id=0, pagina=0):
    if request.method == 'GET':
        if pagina:
            productos = list(Producto.objects.values())
            total_pg = len(productos) / 10
            if len(productos) % 10:
                total_pg = (total_pg - (len(productos) % 10) / 10) + 1

            # print(total_pg)
            if pagina == 1:
                contador = 0
            else:
                contador = (pagina - 1) * 10

            if pagina != int(total_pg):
                limite = contador + 10
            else:
                if len(productos) % 10:
                    limite = contador + (len(productos) % 10)
                else:
                    limite = contador + 10

            # print(pagina)
            # print(total_pg)
            listado_pg = []
            while contador < limite:
                # print(productos[contador])

                listado_pg.append(productos[contador])
                contador += 1

            datos = {'message': "Success", 'productos': listado_pg,
                     'totalPaginas': int(total_pg)}
            # print(listado_pg)
            # print(len(listado_pg))
        else:
            datos = {'message': "Pagina no encontrada"}
    else:
        return HttpResponseNotAllowed(['GET'])

    return JsonResponse(datos)


def pintar_productos_categorias(request, categoria='', pagina=0):
    if request.method == 'GET':
        if pagina and categoria:
            productos = list(Producto.objects.filter(
                categoria=categoria).values())
            if len(productos) > 0:
                total_pg = len(productos) / 10
                if len(productos) % 10:
                    total_pg = (total_pg - (len(productos) % 10) / 10) + 1

                # print(total_pg)
                if pagina == 1:
                    contador = 0
                else:
                    contador = (pagina - 1) * 10

                if pagina != int(total_pg):
                    limite = contador + 10
                else:
                    if len(productos) % 10:
                        limite = contador + (len(productos) % 10)
                    else:
                        limite = contador + 10

                # print(pagina)
                # print(total_pg)
                listado_pg = []
                while contador < limite:
                    # print(productos[contador])

                    listado_pg.append(productos[contador])
                    contador += 1

                datos = {'message': "Success", 'productos': listado_pg,
                         'totalPaginas': int(total_pg)}
                # print(listado_pg)
                # print(len(listado_pg))
            else:
                datos = {'message': "No se encontraron productos"}
        else:
            datos = {'message': "Pagina no encontrada"}
    else:
        return HttpResponseNotAllowed(['GET'])
    return JsonResponse(datos)


def realizar_pedido(request):
    if request.method == 'POST':
        jd = json.loads(request.body)

        Pedido.objects.create(nombre=jd['nombre'], celular=jd['celular'], cantidadProducto=jd['cantidadProductos'],
                              precioTotal=jd['precioTotal'], datosProducto=str(jd['productos']), fecha=jd['fecha'])
        datos = {'message': "Success Post"}
    else:
        return HttpResponseNotAllowed(['POST'])
    return JsonResponse(datos)


""" +++++++++++++++++ ADMINISTRADOR +++++++++++++++++++++++++++++ """


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def registrar_usuario(request):
    if request.method == 'POST':
        if request.user.is_superuser:
            if request.data:
                if 'username' in request.data and 'password' in request.data:
                    try:
                        newUserUsername = request.POST.get('username')
                        newUserPassword = request.POST.get('password')

                        user = User.objects.create_user(
                            username=newUserUsername, password=newUserPassword)
                        user.is_staff = True
                        user.save()
                        datos = {'message': "Success"}
                        # print(datos)
                        return JsonResponse(datos)
                    except:
                        datos = {'message': "Error"}
                else:
                    datos = {'message': "Error"}
            else:
                datos = {'message': "Error"}
        else:
            datos = {'message': "Error"}
    else:
        return HttpResponseNotAllowed(['POST'])
    return JsonResponse(datos)


@api_view(['DELETE', 'GET'])
@permission_classes([IsAuthenticated])
def eliminar_usuario(request, id=0):
    if request.method == 'GET':
        users = User.objects.all()
        if len(users) > 0:
            # print(users)
            listUsers = []
            i = 0
            for user in users:
                listUsers.append({'username': user.username, 'id': user.id, 'is_superuser': user.is_superuser,
                                 'last_login': user.last_login, 'date_joined': user.date_joined})
                # i += 1

            # print(listUsers)
            datos = {'message': "Success", 'users': listUsers}
    elif request.method == 'DELETE':
        if id:
            try:
                user = User.objects.get(id=id)
                user.delete()
                datos = {'message': "Success"}
            except:
                datos = {'message': "Error"}

    return JsonResponse(datos)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    if request.method == 'GET':
        try:
            costosTotales = 0
            costos = list(Costos.objects.values())
            if len(costos) > 0:
                for costo in costos:
                    costosTotales += costo['valor']
        except:
            costosTotales = 0
            print('nell')

        numPedidos = Pedido.objects.filter(estado='Pendiente').count()
        numStock = Producto.objects.count()
        gananciasXventas = 0
        numVentas = Pedido.objects.filter(estado='Realizado')

        for venta in numVentas:
            print(venta.precioTotal)
            gananciasXventas += venta.precioTotal

        # print('Las ganancias totales son: ' + str(gananciasXventas))
        gananciasTotales = gananciasXventas - costosTotales
        data = {'message': "Success", 'numPedidos': numPedidos,
                'numStock': numStock, 'gananciasXventas': gananciasXventas, 'costosTotales': costosTotales,
                'gananciasTotales': gananciasTotales}
    else:
        return HttpResponseNotAllowed(['GET'])
    return JsonResponse(data)


@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def costos(request, id=0):
    if request.method == 'GET':

        costos = list(Costos.objects.values().order_by('-id'))
        print(costos)

        datos = {'message': "Success", 'costos': costos}
    elif request.method == 'POST':
        jd = json.loads(request.body)
        print(jd)
        if not jd['valor'] or not jd['fecha'] or not jd['detalles']:
            return JsonResponse({'message': "Error"})

        try:
            Costos.objects.create(
                valor=jd['valor'], fecha=jd['fecha'], detalles=jd['detalles'])
            datos = {'message': "Success"}
        except:
            datos = {'message': "No se pudo registar el costo"}
    elif request.method == 'DELETE':
        if id:
            try:
                costo = Costos.objects.get(id=id)
                costo.delete()
                datos = {'message': "Success"}
            except:
                datos = {'message': "Error"}
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])
    return JsonResponse(datos)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_producto(request):
    if request.method == 'POST':
        if request.POST and request.FILES:
            Producto.objects.create(nombre=request.POST['nombre'], descripcion=request.POST['descripcion'], categoria=request.POST['categoria'],
                                    colores=request.POST['colores'], estado=request.POST['estado'], precio=request.POST['precio'], stock=request.POST['stock'], imagen=request.FILES['img'])

        datos = {'message': "Success"}
    else:
        return HttpResponseNotAllowed(['POST'])
    return JsonResponse(datos)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_producto(request, id):
    if request.method == 'GET':
        productos = list(Producto.objects.filter(id=id).values())
        if len(productos) > 0:
            producto = productos[0]

            datos = {'message': "Success", 'producto': producto}
        else:
            datos = {'message': "Productos no encontrado"}
    else:
        return HttpResponseNotAllowed(['GET'])

    return JsonResponse(datos)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_productos(request):
    if request.method == 'GET':
        productos = list(Producto.objects.values())
        if len(productos) > 0:
            datos = {'message': "Success", 'productos': productos}
        else:
            datos = {'message': "No se encontraron productos"}
    else:
        return HttpResponseNotAllowed(['GET'])
    return JsonResponse(datos)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def editar_producto(request, id):
    productos = list(Producto.objects.filter(id=id).values())

    if len(productos) > 0:
        producto = Producto.objects.get(id=id)
        producto.nombre = request.POST['nombre']
        producto.descripcion = request.POST['descripcion']
        producto.categoria = request.POST['categoria']
        producto.colores = request.POST['colores']
        producto.estado = request.POST['estado']
        producto.precio = request.POST['precio']
        producto.stock = request.POST['stock']
        print(request.POST)

        if request.FILES:
            if producto.imagen:
                producto.updateImg()

            producto.imagen = request.FILES['img']

            print('IMAGEN')
            print(producto.imagen)

        producto.save()
        datos = {'message': "Success"}
    else:
        datos = {'message': "Productos no encontrados"}
    return JsonResponse(datos)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def eliminar_producto(request, id):
    if request.method == 'DELETE':
        productos = list(Producto.objects.filter(id=id).values())

        if len(productos) > 0:
            Producto.objects.filter(id=id).delete()
            data = {'message': "Success"}
        else:
            data = {'message': "Producto no encontrado"}
    else:
        return HttpResponseNotAllowed(['DELETE'])
    return JsonResponse(data)


class Pedidos(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id=0):
        if id > 0:
            pedidos = list(Pedido.objects.filter(id=id).values())
            if len(pedidos) > 0:
                pedido = list(Pedido.objects.filter(id=id).values())
                datos = {'message': "Success", 'pedido': pedido}
            else:
                datos = {'message': "Pedido no encontrado"}
        else:
            pedidos = list(Pedido.objects.values())
            print('Pedidos cargados: ', len(pedidos))

            if len(pedidos) > 0:
                datos = {'message': "Success", 'pedidos': pedidos}
            else:
                datos = {'message': "Pedidos no encontrados"}
        return JsonResponse(datos)

    def patch(self, request, id):
        jd = json.loads(request.body)

        pedidos = list(Pedido.objects.filter(id=id).values())
        if len(pedidos) > 0:
            pedido = Pedido.objects.get(id=id)
            print('Estado actual: ' + pedido.estado)
            pedido.estado = jd['estado']
            pedido.save()
            print('Nuevo estado: ' + pedido.estado)

            print(len(jd))
            # print(len(jd['productos']))
            if len(jd) > 1:
                if jd['orden'] == 'Restar':
                    for producto in jd['productos']:
                        actProducto = Producto.objects.get(id=producto['id'])
                        actProducto.stock = actProducto.stock - \
                            producto['cantidad']
                        actProducto.save()
                elif jd['orden'] == 'Sumar':
                    for producto in jd['productos']:
                        actProducto = Producto.objects.get(id=producto['id'])
                        actProducto.stock = actProducto.stock + \
                            producto['cantidad']
                        actProducto.save()

            datos = {'message': "Success"}
        else:
            datos = {'message': "Pedidos no encontrados"}
        return JsonResponse(datos)
    
    def delete(self, request):
        try:
            pedidosRechazados = list(Pedido.objects.filter(estado='Rechazado').values())
            print(pedidosRechazados)
            print('Pedidos rechazados: ', len(pedidosRechazados))
            if len(pedidosRechazados) > 0:
                for pedido in pedidosRechazados:
                    print('Pedido: ', pedido['id'])
                    Pedido.objects.filter(id=pedido['id']).delete()
                datos = {'message': "Success"}
            else:
                datos = {'message': "Error al eliminar pedidos"}
        except:
            print('No hay pedidos rechazados')
            datos = {'message': "No hay pedidos rechazados"}

        return JsonResponse(datos)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def editar_pedido(request, id):
    if request.method == 'PATCH':
        jd = json.loads(request.body)
        print(jd)
        pedidos = list(Pedido.objects.filter(id=id).values())

        if len(pedidos) > 0:
            pedido = Pedido.objects.get(id=id)
            pedido.datosProducto = str(jd['datosProducto'])
            pedido.cantidadProducto = jd['productosTotal']
            pedido.precioTotal = jd['precioTotal']
            pedido.save()

            datos = {'message': "Success"}
        else:
            datos = {'message': "Producto no encontrado"}
    else:
        return HttpResponseNotAllowed(['PATCH'])
    return JsonResponse(datos)
