const seccionesPrincipales = document.querySelector('#secciones-principales')


const seccionPendientes = document.querySelector('.seccion-pendientes')
const seccionStock = document.querySelector('.seccion-stock')
const seccionVentas = document.querySelector('.seccion-ventas')
const seccionCostos = document.querySelector('.seccion-costos')
const seccionAgregarCostos = document.querySelector('#seccion-agregar-costos')
const seccionHistorialCostos = document.querySelector('#seccion-historial-costos')

const numPedidosPendientes = document.querySelector('.seccion-pendientes').querySelector('div').querySelector('h3')
const numStock = document.querySelector('.seccion-stock').querySelector('div').querySelector('h3')
const numVentas = document.querySelector('.seccion-ventas').querySelector('div').querySelector('h3')
const numCostos = document.querySelector('.seccion-costos').querySelector('div').querySelector('h3')
const numGanancias = document.querySelector('.seccion-ganancias').querySelector('div').querySelector('h3')

const templateRegistro = document.querySelector('#template-registro').content;

seccionPendientes.addEventListener('click', () => {
    window.location.pathname = '/admin/pedidos/'    
});
seccionStock.addEventListener('click', () => {
    window.location.pathname = '/admin/productos/'    
});

seccionVentas.addEventListener('click', () => {
    window.location.pathname = '/admin/pedidos/'  
    window.localStorage.setItem('seccion', 'ventas')  
});

seccionCostos.addEventListener('click', () => {
    seccionAgregarCostos.classList.toggle('active')
    // seccionesPrincipales.classList.toggle('active')
})

seccionAgregarCostos.addEventListener('click', (e) => {
    mostrarHistorialCostos(e);
    if (e.target.classList.contains('btn-agregar-costos')) {
        if (seccionAgregarCostos.querySelector('#valor').value !== '' && seccionAgregarCostos.querySelector('#detalles').value !== '')  {
            const newCosto = {
                valor: seccionAgregarCostos.querySelector('#valor').value,
                detalles: seccionAgregarCostos.querySelector('#detalles').value,
                fecha: cargarFecha()
            }
            agregarCosto(newCosto);
            
        } else {
            alert('Faltan datos')
        }
        
    }
    
})

seccionHistorialCostos.addEventListener('click', (e) => {
    if (e.target.classList.contains('cerrar')) {
        seccionesPrincipales.classList.toggle('active')
        seccionHistorialCostos.classList.toggle('active')
        
    }
})

document.addEventListener('DOMContentLoaded', ()=>{
    cargarDatos();
})

const mostrarHistorialCostos = e => {
    if (e.target.classList.contains('btn-historial-costos')) {
        seccionesPrincipales.classList.toggle('active')
        seccionAgregarCostos.classList.toggle('active')
        seccionHistorialCostos.classList.toggle('active')
        cargandoHistorialCostos();
    }
    e.stopPropagation();
}

const cargandoHistorialCostos = async() => {
    try {
        const res = await fetch(`/api/costos/0`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${window.API_TOKEN}`
            }
        })
        const data = await res.json()
        // console.log(data.costos)
        pintarHistorialCostos(data.costos);
    } catch (error) {
        console.log(error)
    }
}

const pintarHistorialCostos = (data) => {
    seccionHistorialCostos.querySelector('.historial-costos').innerHTML = ''
    data.forEach(registro => {
        const clone = templateRegistro.cloneNode(true);
        clone.querySelector('.registro-costos-fecha').querySelector('span').innerHTML = registro.fecha;
        clone.querySelector('.registro-costos-valor').querySelector('span').innerHTML = registro.valor;
        clone.querySelector('.registro-costos-detalles').querySelector('span').innerHTML = registro.detalles;
        clone.querySelector('ion-icon').setAttribute('id', registro.id)
        clone.querySelector('ion-icon').addEventListener('click', (e) => {
            console.log(e.target.id)
            eliminarCostos(e.target.id);
        })
        seccionHistorialCostos.querySelector('.historial-costos').appendChild(clone);
    })
}

const agregarCosto = async(newCosto) => {
    try {
        const res = await fetch(`/api/costos/0`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': window.CSRF_TOKEN,
                'Authorization': `Token ${window.API_TOKEN}`
            },
            body: JSON.stringify(newCosto)
        })
        const data = await res.json()
        if (data.message === 'Success') {
            alert('Costo agregado')
            window.location.reload()
        }
    } catch (error) {
        console.log(error)
    }
}

const eliminarCostos = async(id) => {
    try {
        const res = await fetch(`/api/costos/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': window.CSRF_TOKEN,
                'Authorization': `Token ${window.API_TOKEN}`
            }
        })
        const data = await res.json()
        if (data.message === 'Success') {
            alert('Costo eliminado')
            window.location.reload()
        }
    } catch (error) {
        console.log(error)
    }
}

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
        console.log(data)
        pintarDatos(data);
    } catch (error) {
        console.log(error)
    }
}

const pintarDatos = (data) => {
    numPedidosPendientes.innerHTML = data.numPedidos
    numStock.innerHTML = data.numStock
    numVentas.innerHTML = "$ " + data.gananciasXventas
    numCostos.innerHTML = "$ " + data.costosTotales
    numGanancias.innerHTML = "$ " + data.gananciasTotales
}

setInterval(() => {
    cargarDatos();
}, 30000);



const cargarFecha = () => {
    let fecha = new Date();
    
    const dia = fecha.getDate();
    const mes = fecha.getMonth();
    const anio = fecha.getFullYear();
    const hora = fecha.getHours();
    const minutos = fecha.getMinutes();
    const segundos = fecha.getSeconds();

    const diaSemana = fecha.getDay();
    const diaSemanaTexto = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

    const mesTexto = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const fechaTexto = `${diaSemanaTexto[diaSemana]}, ${dia} de ${mesTexto[mes]} del ${anio}`;

    const horaTexto = `${hora}:${minutos}:${segundos}`;

    const fechaHora = `${fechaTexto} - ${horaTexto}`;

    return fechaHora;
}