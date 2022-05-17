import json
from django.http import JsonResponse, HttpResponseRedirect, HttpResponseForbidden
from django.shortcuts import render
from django.views import View

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

# Create your views here.
            
@login_required
def inicio(request):
    # print(request.user.username)
    # print(request.user.is_superuser)
    if not request.user.is_staff:
        # print("No es superuser")
        return HttpResponseRedirect('/accounts/logout/')    
    user = User.objects.get(username=request.user)
    token, _ = Token.objects.get_or_create(user=user)

    return render(request, 'paginas/admin.html', {'token': token.key, 'user': user, 'is_superuser': user.is_superuser})

@login_required
def pedidos(request):
    user = User.objects.get(username=request.user)
    token, _ = Token.objects.get_or_create(user=user)
    return render(request, 'paginas/pedidos.html', {'token': token.key})

@login_required
def productos(request):
    user = User.objects.get(username=request.user)
    token, _ = Token.objects.get_or_create(user=user)
    return render(request, 'paginas/productos.html', {'token': token.key})

@login_required
def registro(request):
    user = User.objects.get(username=request.user)
    token, _ = Token.objects.get_or_create(user=user)
    return render(request, 'paginas/registro.html', {'token': token.key})

@login_required
def eliminar_usuario(request):
    user = User.objects.get(username=request.user)
    token, _ = Token.objects.get_or_create(user=user)
    return render(request, 'paginas/eliminar_usuario.html', {'token': token.key})