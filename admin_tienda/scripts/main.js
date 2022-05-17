const URLServer = window.location.origin;
const barraLateral = document.querySelector('#barra-lateral');
// const toggleBtn = document.querySelector('.toggle-btn');
const navInicio = document.querySelector('#nav-inicio');
const navPedidos = document.querySelector('#nav-pedidos');
const navProductos = document.querySelector('#nav-productos');


navInicio.setAttribute('href', `/admin/`);
navPedidos.setAttribute('href', `/admin/pedidos/`);
navProductos.setAttribute('href', `/admin/productos/`);

if (window.innerWidth > 600) {
    document.body.style.display = 'none';
} else {
    document.body.style.display = 'block';
}

window.addEventListener('resize', () => {
    if (window.innerWidth > 600) {
        document.body.style.display = 'none';
    } else {
        document.body.style.display = 'block';
    }
})