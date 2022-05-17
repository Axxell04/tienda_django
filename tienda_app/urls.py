from django.urls import path
from . import views
# from .views import Datos

from django.conf import Settings, settings
from django.contrib.staticfiles.urls import static

urlpatterns = [
    # path('productos/', Datos.as_view(), name='lista_productos'),
    path('', views.inicio, name='inicio'),
    path('carrito/', views.carrito, name='carrito'),
    # path('admin/', views.admin, name='admin'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)