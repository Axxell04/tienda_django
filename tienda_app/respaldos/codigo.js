//Declaramos la funcion para pintar nuestros productos
const pintarCards = data => {
    /*Con la función "forEach" recorremos los datos 
    (a la función "forEach" le debemos asignar un nombre con 
    el cual identificaremos a cada item que vayamos recorriendo)*/
    
    data.forEach(producto => {
        
        // console.log(producto)
        templateCard.querySelector('h4').textContent = producto.nombre
        templateCard.querySelector('p').textContent = producto.descripcion
        templateCard.querySelector('img').setAttribute("src", producto.imagen)
        templateCard.querySelector('.card-btn-agregar').dataset.id = producto.id
        templateCard.querySelector('.card-btn-info').dataset.id = producto.id
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
};


const pintarCards2 = (data, pag) => {
    var pos = posInicial(pag)

    var productos = 0
    while (productos < 10) {
        var producto = data.productos[pos]
        console.log(producto)
        templateCard.querySelector('h4').textContent = producto.nombre
        templateCard.querySelector('p').textContent = producto.descripcion
        templateCard.querySelector('img').setAttribute("src", producto.imagen)
        templateCard.querySelector('.card-btn-agregar').dataset.id = producto.id
        templateCard.querySelector('.card-btn-info').dataset.id = producto.id
        // /*Aqui clonamos el template (utilizando la función 
        // ".cloneNode") para crear la base de las demas tarjetas 
        // que modificaremos posteriormente con la codificación 
        // anteriormente vista */
        const clone = templateCard.cloneNode(true)
        //Aqui asignamos como elemento hijo de "fragment" a "clone"
        fragment.appendChild(clone)

        pos = pos + 1
        productos = productos + 1
    }
    //Aquí asignamos como elemento hijo de "cards" a "fragment"
    cards.appendChild(fragment)
};


// ACTUALIZAR CARRITOOOOOOOOOOOOOOO
const actualizarCarrito = () => {

    if (carritoCompras.innerText !== "") {
        // console.log(carritoCompras.innerText)
        productoOpciones = document.querySelector('#carrito')

        productoOpciones.addEventListener('click', e =>{
            btnAccion(e);
        })

        const btnAccion = e => {
            if (e.target.classList.contains('btnSumar')) {
                const producto = carrito[e.target.dataset.id]
                console.log(e.target.dataset.id)
                // console.log(producto)
                producto.cantidad += 1
                console.log(producto.cantidad)
                carrito[e.target.dataset.id] = producto
                // pintarCarrito();
            } else if (e.target.classList.contains('btnRestar')) {
                const producto = carrito[e.target.dataset.id]
                console.log(producto.cantidad)
                // producto.cantidad--
                
                // if (producto.cantidad === 0) {
                //     delete carrito[e.target.dataset.id]
                // }
        
                // pintarCarrito();
            }

            pintarCarrito();
        
            e.stopPropagation();
        }

    }

}