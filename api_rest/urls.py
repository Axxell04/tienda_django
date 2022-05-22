from django.urls import path
from . import views

urlpatterns = [
    path('productos/', views.listar_productos, name="lista_productos"),
    path('productos/<int:id>', views.obtener_producto, name="obteniendo_producto"),
    path('productos/pagina/<int:pagina>', views.pintar_productos, name="procesando_productos"),
    path('productos/categorias/<str:categoria>/<int:pagina>', views.pintar_productos_categorias, name="procesando_productos"),
    path('realizar_pedido/', views.realizar_pedido, name="realizar_pedido"),
    path('pedidos/', views.Pedidos.as_view(), name="procesando_pedidos"),
    path('pedidos/<int:id>', views.Pedidos.as_view(), name="procesando_pedidos"),
    path('pedidos/editar/<int:id>', views.editar_pedido, name="editar_pedidos"),
    path('productos/editar/<int:id>', views.editar_producto, name="editar_productos"),
    path('productos/crear/', views.crear_producto, name="crear_productos"),
    path('productos/eliminar/<int:id>', views.eliminar_producto, name="eliminar_productos"),
    path('dashboard/', views.dashboard, name="dashboard"),
    path('costos/<int:id>', views.costos, name="procesando_costos"),
    path('register/', views.registrar_usuario, name="register"),
    path('users/<int:id>', views.eliminar_usuario, name="users"),
    # path('login/', views.login, name="login"),
]