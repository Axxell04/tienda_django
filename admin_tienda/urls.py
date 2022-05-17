from re import template
from django.urls import path
from django.conf import Settings, settings
from django.contrib.staticfiles.urls import static


from . import views

urlpatterns = [
    # path('', views.login_view, name="login"),
    path('', views.inicio, name="inicio"),
    path('pedidos/', views.pedidos, name="pedidos"),
    path('productos/', views.productos, name="productos"),
    path('registro/', views.registro, name="registro"),
    path('eliminar_usuario/', views.eliminar_usuario, name="eliminar_usuario"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)