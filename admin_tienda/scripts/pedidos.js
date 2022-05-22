const pedidosPendientes = document.querySelector('#pedidos-pendientes');
const pedidosRealizados = document.querySelector('#pedidos-realizados');
const pedidosRechazados = document.querySelector('#pedidos-rechazados');
const vistaEditarPedido = document.querySelector('#editar-pedidos')

const barraInferior = document.querySelector('#barra-inferior');

const barraRechazados = document.querySelector('.barra-rechazados');
const barraPendientes = document.querySelector('.barra-pendientes');
const barraRealizados = document.querySelector('.barra-realizados');

const numPendientes = document.querySelector('.num-pendientes');
const numRealizados = document.querySelector('.num-realizados');
const numRechazados = document.querySelector('.num-rechazados');
// let numPendientes = 0;
// let numRealizados = 0;
// let numRechazados = 0;


const templatePedido = document.getElementById('template-pedido').content;
const templateProducto = document.getElementById('template-producto').content;
const templateProductoEditar = document.getElementById('template-producto-editar').content;

const fragmentP = document.createElement('div');
const fragmentRCH = document.createElement('div');
const fragmentRAL = document.createElement('div');
const fragmentEditar = document.createElement('div');

let fragmentProductos = document.createDocumentFragment();
const divProducto = document.createElement('div');

// const btnEditarPedido = document.querySelector('.editar-pedido')
let btnEditarPedido;

pedidosPendientes.addEventListener('click', (e) => {
    actualizarPedidos(e);
    editarPedido(e);
});
pedidosRealizados.addEventListener('click', (e) => {
    actualizarPedidos(e);
});
pedidosRechazados.addEventListener('click', (e) => {
    actualizarPedidos(e);
    limpiarPedidos(e);
});
vistaEditarPedido.addEventListener('click', (e) => {
    
    opcionesEdicion(e);
});


let redireccionVentas = false;
if (localStorage.getItem('seccion') === 'ventas') {
    redireccionVentas = true;
}

if (redireccionVentas === true) {
    pedidosPendientes.classList.remove('active');
    pedidosRealizados.classList.add('active');
    redireccionVentas = false;
    localStorage.removeItem('seccion');
}




// NAVEGACIÓN INFERIOR/////////////////////////////////////////////////////////////////////////////////////////////
barraRechazados.addEventListener('click', (e) => {
    
    if (pedidosPendientes.classList.contains('active')) {
        pedidosPendientes.classList.remove('active');
    }
    if (pedidosRealizados.classList.contains('active')) {
        pedidosRealizados.classList.remove('active');
    }
    if (vistaEditarPedido.classList.contains('active')) {
        vistaEditarPedido.classList.remove('active');
    }
    if (pedidosRechazados.classList.contains('active')) {
        return;
    } else {
        pedidosRechazados.classList.add('active');

    }
    establecerFocus();
});
barraPendientes.addEventListener('click', (e) => {
    
    if (pedidosRechazados.classList.contains('active')) {
        pedidosRechazados.classList.remove('active');
    }
    if (pedidosRealizados.classList.contains('active')) {
        pedidosRealizados.classList.remove('active');
    }
    if (vistaEditarPedido.classList.contains('active')) {
        vistaEditarPedido.classList.remove('active');
    }
    if (pedidosPendientes.classList.contains('active')) {
        return;
    } else {
        pedidosPendientes.classList.add('active');
    }
    establecerFocus();
});
barraRealizados.addEventListener('click', (e) => {
    
    if (pedidosPendientes.classList.contains('active')) {
        pedidosPendientes.classList.remove('active');
    }
    if (pedidosRechazados.classList.contains('active')) {
        pedidosRechazados.classList.remove('active');
    }
    if (vistaEditarPedido.classList.contains('active')) {
        vistaEditarPedido.classList.remove('active');
    }
    if (pedidosRealizados.classList.contains('active')) {
        return;
    } else {
        pedidosRealizados.classList.add('active');
    }
    establecerFocus();
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
const establecerFocus = () =>{
    if (pedidosPendientes.classList.contains('active')){
        barraInferior.querySelector('.barra-pendientes').classList.add('active');
        barraInferior.querySelector('.barra-rechazados').classList = 'barra-rechazados'
        barraInferior.querySelector('.barra-realizados').classList = 'barra-realizados'
    }
    if(pedidosRechazados.classList.contains('active')) {
        barraInferior.querySelector('.barra-rechazados').classList.add('active');
        barraInferior.querySelector('.barra-pendientes').classList = 'barra-pendientes'
        barraInferior.querySelector('.barra-realizados').classList = 'barra-realizados'
    } 
    if (pedidosRealizados.classList.contains('active')) {
        barraInferior.querySelector('.barra-realizados').classList.add('active');
        barraInferior.querySelector('.barra-rechazados').classList = 'barra-rechazados'
        barraInferior.querySelector('.barra-pendientes').classList = 'barra-pendientes'
    }
}


document.addEventListener('DOMContentLoaded', () => {
    cargarPedidos();
    establecerFocus();
    // btnEditarPedido = document.querySelector('.editar-pedido')
    // btnEditarPedido.addEventListener('click', (e) =>{

    // });
});

const limpiarPedidos = async(e) => {
    if (e.target.classList.contains('icon-eliminar')){
        try {
            const res = await fetch('/api/pedidos/', {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': window.CSRF_TOKEN,
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${window.API_TOKEN}`
                }
            })
            const data = await res.json();
            if (data.message === 'Success') {
                alert('Pedidos rechazados eliminados');
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
        }
    }
}

const opcionesEdicion = (e) => {
    if (e.target.classList.contains('btn-cancelar')) {
        
        vistaEditarPedido.classList.remove('active');
        pedidosPendientes.classList.add('active');
    } else if (e.target.classList.contains('btn-enviar-edicion')) {
        const arrayProductos = document.querySelector('.productos-editar')
        const nodos = arrayProductos.childNodes;
        const idPedido = e.target.dataset.id
        let productosTotal = 0
        let precioTotal = 0
        let datosProducto = []
        let productoEditado = {}

        nodos.forEach(producto => {
            if (producto.nodeName !== '#text') {
                const creandoProductos = (producto) => {
                    let valorPagar;
                    productoEditado = {
                        id: Number(producto.querySelector('.id-p').querySelector('span').textContent),
                        nombre: producto.querySelector('.nombre-p').querySelector('span').textContent,
                        cantidad: Number(producto.querySelector('#cantidad-p').value),
                        precio: Number(producto.querySelector('.precio-p').querySelector('span').textContent)
                
                    }
                    valorPagar = productoEditado.cantidad * productoEditado.precio
                    productosTotal += productoEditado.cantidad 
                    precioTotal += valorPagar
                    
                    if (productoEditado.cantidad !== 0) {
                        
                        datosProducto.push(productoEditado)
                    }
                
                    return valorPagar;
                }
                precioTotal += creandoProductos(producto);
                
            }
        });

        const productosTotalHTML = vistaEditarPedido.firstElementChild.firstElementChild.querySelector('.pedido-info').firstElementChild.querySelector('span')
        const precioTotalHTML = vistaEditarPedido.firstElementChild.firstElementChild.querySelector('.pedido-info').lastElementChild.querySelector('span')

        productosTotalHTML.textContent = productosTotal;
        precioTotalHTML.textContent = precioTotal;

        subirEdicion(idPedido,Array(datosProducto),productosTotal,precioTotal);

    }
}



const editarPedido = (e) => {
    let id = 0;
    if(e.target.classList.contains('btn-editar-pedido')) {
        id = e.target.dataset.id
        
    }
    if (e.target.classList.contains('btn-editar-pedido-icono')) {
        id = e.target.parentElement.dataset.id
        
    }
    if (id > 0) {
        

        if (pedidosPendientes.classList.contains('active')) {
            pedidosPendientes.classList.remove('active');
        }
        if (pedidosRechazados.classList.contains('active')) {
            pedidosRechazados.classList.remove('active');
        }
        if (pedidosRealizados.classList.contains('active')) {
            pedidosRealizados.classList.remove('active');
        } 
        if (vistaEditarPedido.classList.contains('active')) {
            return;
        } else {
            vistaEditarPedido.classList.add('active');
        }
        if (vistaEditarPedido.firstElementChild) {
            vistaEditarPedido.firstElementChild.innerHTML = ''
        }
        cargarPedidoID(id);

    }

    e.stopPropagation();
}

const subirEdicion = async(id,datosProducto,productosTotal,precioTotal) => {
    const pedidoEditado = {
        'datosProducto': datosProducto[0],
        'productosTotal': productosTotal,
        'precioTotal': precioTotal
    }

    
    try{
        const res = await fetch(`/api/pedidos/editar/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(pedidoEditado),
            headers: {
                'X-CSRFToken': window.CSRF_TOKEN,
                'Content-Type': 'application/json',
                'Authorization': `Token ${window.API_TOKEN}`
            }
        });

        const data = await res.json();
        fragmentP.innerHTML = ''
        await cargarPedidos();
        vistaEditarPedido.classList.remove('active');
        pedidosPendientes.classList.add('active');

    } catch(error) {
        console.log(error)
    }
}

const cargarPedidoID = async(id) => {
    try{
        const res = await fetch(`/api/pedidos/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${window.API_TOKEN}`
            }
        });
        const data = await res.json()
        
        pintarPedidoID(data.pedido)
    } catch (error) {
        console.log(error)
    }
}



const cambiarVista = (e) => {
    if (e.target.classList.contains('barra-inferior')) {
        return;
    } else {
        if(e.target.offsetParent.firstElementChild.classList.contains('barra-rechazados')){
            
        } else if (e.target.offsetParent.firstElementChild.classList.contains('barra-realizados')) {
            
        } else if (e.target.offsetParent.firstElementChild.classList.contains('barra-pendientes')) {
            
        }

    }
}

const actualizarPedidos = (e) => {
    if (e.target.classList.contains('btn-realizado')) {
        const id = e.target.dataset.id;
        const orden = e.target.dataset.orden;
        
        const productosHTML = e.target.parentElement.parentElement.parentElement.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild
        const datosProductos = []

        productosHTML.childNodes.forEach(producto => {
            if (producto.nodeName !== '#text') {
                const productoObjeto = {
                    id: Number(producto.querySelector('.id-p').querySelector('span').textContent),
                    cantidad: Number(producto.querySelector('.cantidad-p').querySelector('span').textContent),
                }
                
                datosProductos.push(productoObjeto)

            }
        })

        

        const actualizar = async() => {
            await cambiarEstado(id, 'realizado', datosProductos, orden);
            fragmentP.innerHTML = '';
            fragmentRAL.innerHTML = '';
            fragmentRCH.innerHTML = '';
            await cargarPedidos();
        }
        actualizar();
    } else 
    if (e.target.classList.contains('btn-rechazar')) {
        const id = e.target.dataset.id;
        const productosHTML = e.target.parentElement.parentElement.parentElement.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild
        const datosProductos = []

        productosHTML.childNodes.forEach(producto => {
            if (producto.nodeName !== '#text') {
                const productoObjeto = {
                    id: Number(producto.querySelector('.id-p').querySelector('span').textContent),
                    cantidad: Number(producto.querySelector('.cantidad-p').querySelector('span').textContent),
                }
                
                datosProductos.push(productoObjeto)

            }
        })

        
        const actualizar = async() => {
            await cambiarEstado(id, 'rechazado', datosProductos);
            fragmentP.innerHTML = '';
            fragmentRAL.innerHTML = '';
            fragmentRCH.innerHTML = '';
            await cargarPedidos();
        }
        actualizar();
    } else
    if (e.target.classList.contains('btn-deshacer')) {
        const id = e.target.dataset.id;
        let orden = ''
        if(e.target.dataset.orden){
            orden = e.target.dataset.orden;
        }
        
        const productosHTML = e.target.parentElement.parentElement.parentElement.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild
        const datosProductos = []

        productosHTML.childNodes.forEach(producto => {
            if (producto.nodeName !== '#text') {
                const productoObjeto = {
                    id: Number(producto.querySelector('.id-p').querySelector('span').textContent),
                    cantidad: Number(producto.querySelector('.cantidad-p').querySelector('span').textContent),
                }
                
                datosProductos.push(productoObjeto)

            }
        })

        
        const actualizar = async() => {
            await cambiarEstado(id, 'pendiente', datosProductos, orden);
            fragmentP.innerHTML = '';
            fragmentRAL.innerHTML = '';
            fragmentRCH.innerHTML = '';
            await cargarPedidos();
        }
        actualizar();
    } 
    
    


    e.stopPropagation();
}


const cambiarEstado = async(id,estado,datosProductos,orden) => {
    try {   
        let cambioEstado = {}

        if (estado === 'realizado') {
            cambioEstado = {
                "estado": "Realizado",
                "orden": orden,
                "productos": datosProductos
            }
        } else if (estado === 'pendiente') {
            cambioEstado = {
                "estado": "Pendiente",
                "orden": orden,
                "productos": datosProductos
            }
        } else if (estado === 'rechazado') {
            cambioEstado = {
                "estado": "Rechazado",
                // "productos": datosProductos
            }
        }

        const data = await fetch(`/api/pedidos/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(cambioEstado),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': window.CSRF_TOKEN,
                'Authorization': `Token ${window.API_TOKEN}`
            }
        })

        const res = await data.json();
        

    } catch (error) {
        console.log(error);
    }
}

const cargarPedidos = async() => {
    try{
        const res = await fetch(`/api/pedidos/`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${window.API_TOKEN}`
            }
        })
        const data = await res.json();

        
        
        pintarPedidos(data.pedidos);
        

    } catch (error) {
    console.log(error)
    }
}

const reemplazarChar = (str) => {
    let str2 = str.replace(/\'/g, '"');
    return str2;
}

const pintarPedidos = (pedidos) => {
    // const datosPro = res.pedidos[0].datosProducto     
    // const datosNuevos = reemplazarChar(datosPro);
    
    pedidos.forEach(pedido => {
        
        const datosProducto = JSON.parse(reemplazarChar(pedido.datosProducto));
        templatePedido.querySelector('.nombre').innerHTML = `<h3>CLIENTE</h3> <p>${pedido.nombre}</p>`;
        templatePedido.querySelector('.celular').innerHTML = `<h3>CONTACTO</h3> <p>${pedido.celular}</p>`;
        templatePedido.querySelector('.celular').querySelector('p').classList.add('active');
        templatePedido.querySelector('#btn-contactar').setAttribute('href', `https://api.whatsapp.com/send?phone=593${pedido.celular}`);
        // let celularForm = document.createElement('input');
        // celularForm.type = 'number';
        // celularForm.value = pedido.celular;
        // templatePedido.querySelector('.celular').appendChild(celularForm);
        templatePedido.querySelector('.btn-editar-pedido').dataset.id = pedido.id;
        templatePedido.querySelector('.productos-totales').innerHTML = `<h4>Productos Totales</h4> <span>${pedido.cantidadProducto}</span>`
        templatePedido.querySelector('.precio-total').innerHTML = `<h4>Precio Total</h4> <span>${pedido.precioTotal}</span>`
        templatePedido.querySelector('.fecha').querySelector('span').innerHTML = pedido.fecha;
        templatePedido.querySelector('.btn-rechazar').dataset.id = pedido.id;
        templatePedido.querySelector('.btn-realizado').dataset.id = pedido.id;
        templatePedido.querySelector('.btn-deshacer').dataset.id = pedido.id;

        if (pedido.estado === 'Pendiente') {
            templatePedido.querySelector('.btn-realizado').dataset.orden = 'Restar';
        }
        if (pedido.estado === 'Realizado') {
            templatePedido.querySelector('.btn-deshacer').dataset.orden = 'Sumar';
        }
        if (pedido.estado === 'Rechazado') {
            templatePedido.querySelector('.btn-deshacer').dataset.orden = '';
        }

        if (pedido.estado === 'Pendiente') {
            templatePedido.querySelector('.btn-rechazar').style.display = 'grid';
            templatePedido.querySelector('.btn-realizado').style.display = 'grid';
            templatePedido.querySelector('.btn-deshacer').style.display = 'none';
            templatePedido.querySelector('.btn-cancelar').style.display = 'none';
            templatePedido.querySelector('.btn-enviar-edicion').style.display = 'none';
            templatePedido.querySelector('.pedido-acciones').style.gridTemplateColumns = '1fr 1fr';
            templatePedido.querySelector('.btn-editar-pedido').style.display = 'grid';
            templatePedido.firstElementChild.firstElementChild.style.gridTemplateColumns = '1fr .4fr 1fr';
        } else if (pedido.estado === 'Realizado' || pedido.estado === 'Rechazado') {
            templatePedido.querySelector('.btn-rechazar').style.display = 'none';
            templatePedido.querySelector('.btn-realizado').style.display = 'none';
            templatePedido.querySelector('.btn-deshacer').style.display = 'grid';
            templatePedido.querySelector('.btn-cancelar').style.display = 'none';
            templatePedido.querySelector('.btn-enviar-edicion').style.display = 'none';
            templatePedido.querySelector('.btn-deshacer').style.color = '#000';
            templatePedido.querySelector('.pedido-acciones').style.gridTemplateColumns = '1fr';
            templatePedido.querySelector('.btn-editar-pedido').style.display = 'none';
            templatePedido.firstElementChild.firstElementChild.style.gridTemplateColumns = '1fr 1fr';
            
        }
        

        datosProducto.forEach(producto => {
            
            templateProducto.querySelector('.id-p').innerHTML = `<h4>ID:</h4> <span>${producto.id}</span>`
            templateProducto.querySelector('.nombre-p').innerHTML = `<h4>NOMBRE</h4> <span>${producto.nombre}</span>`
            templateProducto.querySelector('.cantidad-p').innerHTML = `<h4>CANTIDAD</h4> <span>${producto.cantidad}</span>`
            templateProducto.querySelector('.precio-p').innerHTML = `<h4>PRECIO</h4> <span>${producto.precio}</span>`

            const cloneProducto = templateProducto.cloneNode(true);
            
            divProducto.appendChild(cloneProducto);
                        
            
        })
        
        divProducto.className = 'productos';
        if (divProducto.classList.contains('productos')) {
            if (datosProducto.length > 1) {
                divProducto.style.gridTemplateColumns = `repeat(2, 1fr)`;
                
            } else if (datosProducto.length === 1) {
                divProducto.style.gridTemplateColumns = `repeat(1, 1fr)`;
            }

        }

        templatePedido.querySelector('#contenedor-productos').appendChild(divProducto);
        
        
        const clone = templatePedido.cloneNode(true);

        if (pedido.estado === 'Pendiente') {
            fragmentP.appendChild(clone);
        } else if (pedido.estado === 'Realizado') {
            fragmentRAL.appendChild(clone);
        } else if (pedido.estado === 'Rechazado') {
            fragmentRCH.appendChild(clone);
        }

        divProducto.innerHTML = '';
    })
    
    pedidosPendientes.appendChild(fragmentP);
    pedidosRealizados.appendChild(fragmentRAL);
    pedidosRechazados.appendChild(fragmentRCH);
    

    numPendientes.innerHTML = pedidosPendientes.firstElementChild.childElementCount;
    numRechazados.innerHTML = pedidosRechazados.firstElementChild.nextElementSibling.childElementCount;
    numRealizados.innerHTML = pedidosRealizados.firstElementChild.childElementCount;
    
    
}

const pintarPedidoID = (pedidos, id) => {
    // const datosPro = res.pedidos[0].datosProducto     
    // const datosNuevos = reemplazarChar(datosPro);
    
    pedidos.forEach(pedido => {
        
        const datosProducto = JSON.parse(reemplazarChar(pedido.datosProducto));
        templatePedido.querySelector('.nombre').innerHTML = `<h3>CLIENTE</h3> <p>${pedido.nombre}</p>`;
        templatePedido.querySelector('.celular').innerHTML = `<h3>CONTACTO</h3> <p>${pedido.celular}</p>`;
        templatePedido.querySelector('.celular').querySelector('p').style.display = 'grid';
        
        templatePedido.querySelector('.btn-editar-pedido').dataset.id = pedido.id;
        templatePedido.querySelector('.productos-totales').innerHTML = `<h4>Productos Totales</h4> <span>${pedido.cantidadProducto}</span>`
        templatePedido.querySelector('.precio-total').innerHTML = `<h4>Precio Total</h4> <span>${pedido.precioTotal}</span>`
        templatePedido.querySelector('.fecha').querySelector('span').innerHTML = pedido.fecha;
        // templatePedido.querySelector('.btn-rechazar').dataset.id = pedido.id;
        // templatePedido.querySelector('.btn-realizado').dataset.id = pedido.id;
        // templatePedido.querySelector('.btn-deshacer').dataset.id = pedido.id;
        templatePedido.querySelector('.btn-cancelar').dataset.id = pedido.id;
        templatePedido.querySelector('.btn-enviar-edicion').dataset.id = pedido.id;

        if (pedido.estado === 'Pendiente') {
            templatePedido.querySelector('.btn-rechazar').style.display = 'none';
            templatePedido.querySelector('.btn-realizado').style.display = 'none';
            templatePedido.querySelector('.btn-deshacer').style.display = 'none';
            templatePedido.querySelector('.btn-cancelar').style.display = 'grid';
            templatePedido.querySelector('.btn-enviar-edicion').style.display = 'grid';
            templatePedido.querySelector('.pedido-acciones').style.gridTemplateColumns = '1fr 1fr';
            templatePedido.querySelector('.btn-editar-pedido').style.display = 'none';
            templatePedido.firstElementChild.firstElementChild.style.gridTemplateColumns = '1fr 1fr';
        }
        

        datosProducto.forEach(producto => {
            
            templateProductoEditar.querySelector('.id-p').innerHTML = `<h4>ID:</h4> <span>${producto.id}</span>`
            templateProductoEditar.querySelector('.nombre-p').innerHTML = `<h4>NOMBRE</h4> <span>${producto.nombre}</span>`
            // templateProductoEditar.querySelector('.cantidad-p').innerHTML = `<h4>CANTIDAD</h4> <span>${producto.cantidad}</span>`
            templateProductoEditar.querySelector('#cantidad-p').value = producto.cantidad
            templateProductoEditar.querySelector('.precio-p').innerHTML = `<h4>PRECIO</h4> <span>${producto.precio}</span>`

            const cloneProducto = templateProductoEditar.cloneNode(true);
            
            divProducto.appendChild(cloneProducto);
                        
            
        })
        
        divProducto.className = 'productos-editar';
        if (divProducto.classList.contains('productos-editar')) {
            if (datosProducto.length > 1) {
                divProducto.style.gridTemplateColumns = `repeat(2, 1fr)`;
                
            } else if (datosProducto.length === 1) {
                divProducto.style.gridTemplateColumns = `repeat(1, 1fr)`;
            }

        }

        templatePedido.querySelector('#contenedor-productos').appendChild(divProducto);
        
        
        const clone = templatePedido.cloneNode(true);

        // if (pedido.estado === 'Pendiente') {
        //     fragmentP.appendChild(clone);
        // } else if (pedido.estado === 'Realizado') {
        //     fragmentRAL.appendChild(clone);
        // } else if (pedido.estado === 'Rechazado') {
        //     fragmentRCH.appendChild(clone);
        // }
        fragmentEditar.appendChild(clone);

        divProducto.innerHTML = '';
    })
    
    // pedidosPendientes.appendChild(fragmentP);
    // pedidosRealizados.appendChild(fragmentRAL);
    // pedidosRechazados.appendChild(fragmentRCH);
    // vistaEditarPedido.removeChild(div);
    vistaEditarPedido.appendChild(fragmentEditar);

    

    numPendientes.innerHTML = pedidosPendientes.firstElementChild.childElementCount;
    numRechazados.innerHTML = pedidosRechazados.firstElementChild.nextElementSibling.childElementCount;
    numRealizados.innerHTML = pedidosRealizados.firstElementChild.childElementCount;
    
}
