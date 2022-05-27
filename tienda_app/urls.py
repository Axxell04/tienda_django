from django.urls import path
from . import views
# from .views import Datos

from django.conf import Settings, settings
from django.contrib.staticfiles.urls import static

urlpatterns = [
    path('', views.inicio, name='inicio'),
    path('carrito/', views.carrito, name='carrito'),
    path('busqueda/<int:ID>', views.busqueda, name='busqueda_ID'),
    path('busqueda/<str:PC>', views.busqueda, name='busqueda_PC'),
    
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)