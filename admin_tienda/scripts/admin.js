const seccionPendientes = document.querySelector('.seccion-pendientes')
const seccionStock = document.querySelector('.seccion-stock')

const numPedidosPendientes = document.querySelector('.seccion-pendientes').querySelector('div').querySelector('h3')
const numStock = document.querySelector('.seccion-stock').querySelector('div').querySelector('h3')
const numGanancias = document.querySelector('.seccion-ventas').querySelector('div').querySelector('h3')


seccionPendientes.addEventListener('click', () => {
    window.location.pathname = '/admin/pedidos/'    
});
seccionStock.addEventListener('click', () => {
    window.location.pathname = '/admin/productos/'    
});

document.addEventListener('DOMContentLoaded', ()=>{
    cargarDatos();
})

const cargarDatos = async() => {
    try{
        const res = await fetch(`/api/dashboard/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${window.API_TOKEN}`
            }
        })
        const data = await res.json()
        pintarDatos(data);
    } catch (error) {
        console.log(error)
    }
}

const pintarDatos = (data) => {
    numPedidosPendientes.innerHTML = data.numPedidos
    numStock.innerHTML = data.numStock
    numGanancias.innerHTML = "$ " + data.gananciasTotales
}

setInterval(() => {
    cargarDatos();
}, 30000);