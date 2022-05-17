//Declaración y captura de elementos html 
// const carritoCompras = document.getElementById('carrito')
const cards = document.querySelector('.contenedor-cards')
const paginacion = document.querySelector('.paginacion')
const presentacion = document.getElementById('borrar-p')
const contenedorCarrito = document.querySelector('.contenedor-carrito')

// const btnSiguiente = document.querySelector('.btnSiguiente')
// const btnAnterior = document.querySelector('.btnAnterior')
const btnCategorias = document.querySelector('#btn-categorias')
const menuNavIzquierda = document.querySelector('.menunav_izquierda')


/*Aqui capturamos el template (debemos colocar el ".content" 
al final para poder accerder a su contenido)*/
const templateCard = document.getElementById('template-card').content
// const templateCarrito = document.getElementById('template-carrito').content

const fragment = document.createDocumentFragment()

let pagina = 1
let paginaCat = 1
let paginasTotales = 0 //Establecemos la paginas totales disponibles para cargar
let categoriaActual = ''

// var detallesVisible = false
let carrito = {}
let numCarrito = {}

//Declaración que nos permite escuchar el evento click de todo el container "cards" para poder así interactuar con sus elementos
cards.addEventListener('click', e => {
    mostrarDetalles(e);
    añadirCarrito(e);
})

paginacion.addEventListener('click', e => {
    cambiarPagina(e)
})

btnCategorias.addEventListener('click', e => {
    const categorias = document.querySelector('.categorias-ul')
    categorias.classList.toggle('active')
})

menuNavIzquierda.addEventListener('click', e => {
    cambiarCategoria(e);
    
})

const cambiarCategoria = (e) => {
    let categoria;

    if (e.target.classList.contains('Cat-Tecnologia')) {
        categoria = 'Tecnologia'
    } else if (e.target.classList.contains('Cat-Ropa')) {
        categoria = 'Ropa'
    } else if (e.target.classList.contains('Cat-Accesorios')) {
        categoria = 'Accesorios'
    } else if (e.target.classList.contains('Cat-PV')) {
        categoria = 'Productos Varios'
    } else if (e.target.classList.contains('Cat-Nuevos')) {
        categoria = 'Nuevos'
    }

    if (categoria) {
        pagina = 1
        fetchDataCategoria(categoria)
        e.target.parentElement.parentElement.classList.remove('active')
    }

    e.stopPropagation(e);

}

//Función que nos permite indicarle al "EventListener" la tarjeta especifica que queremos capturar y a su ves nos permite iteracturar con su contenido
const cambiarPagina = (e) => {
    //EL contenido de if nos dara un valor de true o false 
    if (e.target.classList.contains('btnSiguiente')) {
        if (pagina < paginasTotales) {
            pagina += 1
            if (categoriaActual !== ''){
                fetchDataCategoria(categoriaActual)
            } else {
                fetchData();
            }
        }
    }
    else if (e.target.classList.contains('btnAnterior')) {
        if (pagina > 1) {
            pagina -= 1
            if (categoriaActual !== ''){
                fetchDataCategoria(categoriaActual)
            } else {
                fetchData();
            }
        }
    }
    //Función que nos permite deneter la propagación del evento "click"
    e.stopPropagation()
}

const mostrarDetalles = (e) => {

    if (e.target.classList.contains('card-btn-detalles')) {
        var objetivo = e.target.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.lastElementChild
        
        objetivo.classList.toggle('active');
    }

    e.stopPropagation()
}

const añadirCarrito = (e) => {

    if (e.target.classList.contains('card-btn-agregar')) {
        const msgAñadido = document.querySelector('#msg-añadido')

        var cardProducto = e.target.parentElement.parentElement.parentElement
        
        crearCarrito(cardProducto);
        setTimeout(() => {
            msgAñadido.classList.add('active')
        }, 500)
        setTimeout(() => {
            msgAñadido.classList.remove('active')
        }, 3000)
    }

    e.stopPropagation()
}


function crearCarrito (cardProducto) {

    
    let productoId = cardProducto.lastElementChild.firstElementChild.firstElementChild.dataset.id
    let productoNombre = cardProducto.firstElementChild.lastElementChild.querySelector('h4').textContent
    let productoImg = cardProducto.firstElementChild.firstElementChild.firstElementChild.attributes.src.textContent
    let productoPrecio = cardProducto.firstElementChild.firstElementChild.lastElementChild.firstElementChild.querySelector('.precio').textContent
    let productoDescripcion = cardProducto.firstElementChild.firstElementChild.lastElementChild.firstElementChild.querySelector('.descripcion').textContent
    let productoColores = cardProducto.firstElementChild.firstElementChild.lastElementChild.firstElementChild.querySelector('.color').textContent
    
    const producto = {
        id: productoId,
        nombre: productoNombre,
        img: productoImg,
        precio: productoPrecio,
        detalles: productoDescripcion,
        colores: productoColores,
        cantidad: 1
    }

    const num = {
        numero: 1
    }

    // carrito[producto.id] = {...producto}

    // carrito.push(producto)

    if(localStorage.carrito) {
        carrito = JSON.parse(localStorage.carrito)
        // carrito.push(producto)
        if (carrito.hasOwnProperty(producto.id)) {
            producto.cantidad = carrito[producto.id].cantidad + 1
        }
        carrito[producto.id] = {...producto}

        localStorage.carrito = JSON.stringify(carrito)

        //NUM CARRITO **************
        numCarrito = JSON.parse(localStorage.numCarrito)
        numCarrito['numero'] += 1
        pintarNumCarrito(numCarrito.numero);

        localStorage.numCarrito = JSON.stringify(numCarrito)
    } else {
        // carrito.push(producto)
        if (carrito.hasOwnProperty(producto.id)) {
            producto.cantidad = carrito[producto.id].cantidad + 1
        }
        carrito[producto.id] = {...producto}
        localStorage.carrito = JSON.stringify(carrito)
        
        numCarrito = num
        localStorage.numCarrito = JSON.stringify(numCarrito)
        pintarNumCarrito(numCarrito.numero);

        // localStorage.numCarrito = numCarrito
    }

}



let URLServer = window.location.origin

let Api_URL = `${URLServer}/api/productos/pagina/`


document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    if(localStorage.numCarrito) {
        numCarrito = JSON.parse(localStorage.numCarrito)
        pintarNumCarrito(numCarrito.numero);
    }
    pintarNav();
    setTimeout(() => {pintarNumCarrito(numCarrito.numero);}, 1000);
    
})


const fetchData = async () => {
    try {
        //Aqui estamos capturando en la constante "res", el contenido obtenido del archivo ".json" mediante la utilización de 'await' 
        const res = await fetch(Api_URL + pagina)
        //Aqui estamos solicitando que de la constante "res" se nos entreguen los datos en formato ".json", para así poder guardarlos en la constante "data"
        const data = await res.json()
        paginasTotales = data.totalPaginas
        //Llamos la función "pintarCards" y le damos los datos que nos pide, los cuales son los mismos que acabamos de capturar en la constante "data"
        pintarCards(data.productos);
        
    } catch (error) {
        console.log(error)
    }
}

const fetchDataCategoria = async (categoria) => {
    try {
        const res = await fetch(`${URLServer}/api/productos/categorias/${categoria}/${pagina}`)
        const data = await res.json()
        if (data.message = 'Success') {
            
            pintarCards(data.productos);
            paginasTotales = data.totalPaginas

            categoriaActual = categoria
        }

    } catch (error) {
        console.log(error)
    }
}


//Declaramos la funcion para pintar nuestros productos
const pintarCards = data => {
    /*Con la función "forEach" recorremos los datos 
    (a la función "forEach" le debemos asignar un nombre con 
    el cual identificaremos a cada item que vayamos recorriendo)*/
    cards.innerHTML = ''

    data.forEach(producto => {
        
        
        templateCard.querySelector('h4').textContent = producto.nombre
        // templateCard.querySelector('p').textContent = producto.descripcion
        templateCard.querySelector('img').setAttribute("src", producto.imagen)
        // templateCard.querySelector('.detalles').textContent = producto.descripcion
        templateCard.querySelector('.precio').textContent = producto.precio
        templateCard.querySelector('.descripcion').textContent = producto.descripcion
        templateCard.querySelector('.color').textContent = producto.colores
        if(producto.stock > 0) {
            templateCard.querySelector('.stock').textContent = producto.stock
        } else {
            templateCard.querySelector('.stock').textContent = 'Bajo Pedido'
        }
        templateCard.querySelector('.estado').textContent = producto.estado 
        templateCard.querySelector('.card-btn-agregar').dataset.id = producto.id
        templateCard.querySelector('.card-btn-detalles').dataset.id = producto.id
        // if (detallesVisible === true){
        //     templateCard.getElementById('detalles').className = "detalles"
        // }
        // else {
        //     templateCard.getElementById('detalles').className = "detalles oculto"
        // }
        /*Aqui clonamos el template (utilizando la función 
        ".cloneNode") para crear la base de las demas tarjetas 
        que modificaremos posteriormente con la codificación 
        anteriormente vista */
        const clone = templateCard.cloneNode(true)
        //Aqui asignamos como elemento hijo de "fragment" a "clone"
        fragment.appendChild(clone)



    })
    //Aquí asignamos como elemento hijo de "cards" a "fragment"
    cards.appendChild(fragment)
    if (pagina === 1) {
        window.scroll(0, 0)
    }
    else if (pagina != 1) {
        window.scroll(0, 0)
    }
    
};

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

document.addEventListener('mousemove', () => {
    if (window.innerWidth > 600) {
    pintarNumCarrito(numCarrito.numero);
    }
})





