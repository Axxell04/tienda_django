const carritoCompras = document.getElementById('carrito')
const btnVaciar = document.querySelector('.btnVaciar')
const btnPedir = document.querySelector('.btnPedir')
const footerCarrito = document.getElementById('footer')
const form = document.getElementById('form')
const msgCompra = document.getElementById('contenedor-mensaje')


const templateCarrito = document.getElementById('template-carrito').content
const templateFooter = document.getElementById('template-footer').content

let carrito = {}
let numCarrito = {}
let precioTotal;

let URLServer = window.location.origin + '/'

document.addEventListener('DOMContentLoaded', () => {
    pintarCarrito();
    if(localStorage.numCarrito) {
        numCarrito = JSON.parse(localStorage.numCarrito)
        pintarNumCarrito(numCarrito.numero);
    }

    if (carritoCompras.innerText !== "") {
        carritoCompras.addEventListener('click', e =>{
            btnAccion(e);
        })
    }

    pintarNav();
    
    
})

btnVaciar.addEventListener('click', () => {
    limpiarPagina();
})

btnPedir.addEventListener('click', () => {
    if (Object.keys(carrito).length > 0) {
    form.className = "form"
    }
})



const fragmentCarrito = document.createDocumentFragment()
const pintarCarrito = () => {
    carritoCompras.innerHTML = ""

    if (localStorage.carrito) {
        
        if (Object.keys(carrito).length === 0) {
            carrito = JSON.parse(localStorage.carrito)
            
            numCarrito = JSON.parse(localStorage.numCarrito)

        }

        Object.values(carrito).forEach(producto => {
            if (producto !== null){

                templateCarrito.querySelector('.nombreC').textContent = producto.nombre
                templateCarrito.querySelector('.detallesC').textContent = producto.detalles
                templateCarrito.querySelector('.colorC').textContent = producto.colores
                templateCarrito.querySelector('.precioC').textContent = producto.precio + ' $'
                templateCarrito.querySelector('.cantidadC').textContent = producto.cantidad
                templateCarrito.querySelector('img').setAttribute("src", producto.img)
                templateCarrito.querySelector('.btnSumar').dataset.id = producto.id
                templateCarrito.querySelector('.btnRestar').dataset.id = producto.id

                const clone = templateCarrito.cloneNode(true)
        
                fragmentCarrito.appendChild(clone)

            }            

        })

        carritoCompras.appendChild(fragmentCarrito)
        localStorage.carrito = JSON.stringify(carrito)
        localStorage.numCarrito = JSON.stringify(numCarrito)
    }

    pintarFooter();
    
}

const btnAccion = e => {
    if (e.target.classList.contains('btnSumar')) {
        const producto = carrito[e.target.dataset.id]
        
        producto.cantidad += 1
        numCarrito.numero += 1
        pintarNumCarrito(numCarrito.numero);
    }

    if (e.target.classList.contains('btnRestar')) {
        const producto = carrito[e.target.dataset.id]

        producto.cantidad -= 1
        numCarrito.numero -= 1
        pintarNumCarrito(numCarrito.numero);
        
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
            
            if(Object.keys(carrito).length === 0) {
                localStorage.removeItem('carrito')
                localStorage.removeItem('numCarrito')
            }
        }
    }

    pintarCarrito();

    e.stopPropagation();
}

const fragmentFooter = document.createDocumentFragment()
const pintarFooter = () => {
    footer.innerHTML = ""

    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `<h2> !!Carrito Vacío, vaya a inicio para agregar productos¡¡ </h2>`
        footer.querySelector('h2').addEventListener('click', ()=>{
            window.location.pathname = "/"
        })
        footer.querySelector('h2').style.textAlign = 'center'
        footer.querySelector('h2').style.backgroundColor = 'white'
        footer.querySelector('h2').style.padding = '10px'
        footer.querySelector('h2').style.color = 'black'
        footer.querySelector('h2').style.borderRadius = '10px'
        footer.style.gridTemplateColumns = '1fr'

        return
    }

    const cantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0)

    const precio = Object.values(carrito).reduce((acc, {cantidad,precio}) => acc + cantidad * precio, 0)

    templateFooter.querySelector('.total-productos').textContent = cantidad
    templateFooter.querySelector('.total-precio').textContent = precio.toFixed(2) + ' $'
    precioTotal = precio.toFixed(2);
    

    const clone = templateFooter.cloneNode(true);
    fragmentFooter.appendChild(clone);
    footer.appendChild(fragmentFooter)

}


const carritoHTML = document.querySelector('.abrir-carrito')
const carritoNum = document.querySelector('.carritoNum')


window.addEventListener('resize', () => {
    setTimeout(() => {
        carritoNum.classList.add('oculto');
        pintarNumCarrito(numCarrito.numero);
        localStorage.URLServer = URLServer
        pintarNav();

    }, 1000)
})

let date = ''

///FECHA Y HORA 
let fecha = new Date();

const cargarFecha = () => {
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

    date = fechaHora;
}
cargarFecha();

// FORMULARIO /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const btnEnviar = document.getElementById('enviar')
const btnCancelar = document.getElementById('cancelar')
const inputNombre = document.getElementById('nombre')
const inputCelular = document.getElementById('celular')
const validacion = document.getElementById('validacion')
const formContainer = document.querySelector('.form-container')

btnEnviar.addEventListener('click', () => {

    if (inputNombre.value === '' || inputCelular.value === '') {
        validacion.textContent = '¡¡Por favor, llene todos los campos!!'
        setTimeout(() => {validacion.textContent = ''} , 3000)
        return
    } else {
        // csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        csrf_token = {
            'name': formContainer.firstElementChild.name,
            'value': formContainer.firstElementChild.value
        }
        token = `csrfmiddlewaretoken: ${csrf_token.value}`
        nombrePedido = inputNombre.value
        celularPedido = Number(inputCelular.value)
        numProductos = numCarrito.numero

        let datosProductos = []
        let productos = {}
        
        Object.values(carrito).forEach(producto => {
            productos = {
                id: producto.id,
                nombre: producto.nombre,
                cantidad: producto.cantidad,
                precio: producto.precio
            }

            datosProductos.push(productos)
            
        })
        
        pedido = {
            nombre: nombrePedido,
            celular: celularPedido,
            productos: datosProductos,
            cantidadProductos: numProductos,
            precioTotal: precioTotal,
            fecha: date
        }
    }

    
    enviarPedido();

    ocultarForm();
    limpiarPagina();    
    
    msgCompra.className = 'active';
    
})

const enviarPedido = async () => {
    try {
        
        const respuesta = await fetch(URLServer + 'api/realizar_pedido/', {
            method: 'POST',
            body: JSON.stringify(pedido),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': window.CSRF_TOKEN
                
            }
        });
        const data = await respuesta.json()
        
    } catch (error) {
        console.log(error)
    }

}

inputCelular.addEventListener('keypress', (e) => {
    
    if (e.key !== '0' && e.key !== '1' && e.key !== '2' && e.key !== '3' && e.key !== '4' && e.key !== '5' && e.key !== '6' && e.key !== '7' && e.key !== '8' && e.key !== '9') {
        e.preventDefault()
    }
})

btnCancelar.addEventListener('click', () => {
    ocultarForm();
})




//Limpiar Pagina//
const limpiarPagina = () => {
    carrito = {}
    numCarrito = {}
    
    localStorage.removeItem('carrito');
    localStorage.removeItem('numCarrito');
    pintarCarrito();
    pintarNumCarrito(numCarrito.numero);
}

const ocultarForm = () => {
    inputNombre.value = ''
    inputCelular.value = ''
    form.className = 'oculto'
}