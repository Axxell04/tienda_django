const productosDiv = document.createElement('div')
const tablaProductos = document.getElementById('tabla-productos')
const contenedorProductos = document.getElementById('contenedor-productos')

// VISTAS //

const vistaListarProductos = document.querySelector('#tabla-productos')
const vistaEditarProductos = document.querySelector('#editar-productos')
const vistaAñadirProductos = document.querySelector('#añadir-productos')

// BARRA INFERIOR //
const menuNavInferior = document.querySelector('#barra-inferior')
const menuNavStock = document.querySelector('.barra-productos-stock')
const menuNavEditar = document.querySelector('.barra-productos-editar')
const menuNavAñadir = document.querySelector('.barra-productos-añadir')

// EDITAR PRODUCTOS //
const formBusqueda = document.querySelector('.form-busqueda')
const barraEdicion = document.querySelector('#barra-edicion')
const msgNoEncontrado = document.querySelector('#msg-no-encontrado')
const btnE_Buscar = document.querySelector('#btnE-buscar')
const formEditar = document.querySelector('.form-editor')
const btnE_Enviar = document.querySelector('#btnE-Enviar')
const btn_Eliminar = document.querySelector('#btn-Eliminar')
const formImg_E = document.querySelector('#img-E')

// AÑADIR PRODUCTOS //
const barraAñadir = document.querySelector('#barra-añadir')
const formAñadir = document.querySelector('.form-añadir')
const btnA_Enviar = document.querySelector('#btnA-Enviar')
const formImg_A = document.querySelector('#img-A')

let idProducto = 0

// NAVEGACIÓN INFERIOR/////////////////////////////////////////////////////////////////////////////////////////////
menuNavEditar.addEventListener('click', (e) => {
    
    if (vistaAñadirProductos.classList.contains('active')) {
        vistaAñadirProductos.classList.remove('active');
    }
    if (vistaListarProductos.classList.contains('active')) {
        vistaListarProductos.classList.remove('active');
    }
    if (vistaEditarProductos.classList.contains('active')) {
        return;
    } else {
        vistaEditarProductos.classList.add('active');
    }
    establecerFocus();
});
menuNavStock.addEventListener('click', (e) => {
    
    if (vistaAñadirProductos.classList.contains('active')) {
        vistaAñadirProductos.classList.remove('active');
    }
    if (vistaEditarProductos.classList.contains('active')) {
        vistaEditarProductos.classList.remove('active');
    }
    if (vistaListarProductos.classList.contains('active')) {
        return;
    } else {
        vistaListarProductos.classList.add('active');        
    }
    establecerFocus();
});
menuNavAñadir.addEventListener('click', (e) => {
    
    if (vistaEditarProductos.classList.contains('active')) {
        vistaEditarProductos.classList.remove('active');
    }
    if (vistaListarProductos.classList.contains('active')) {
        vistaListarProductos.classList.remove('active');
    }
    if (vistaAñadirProductos.classList.contains('active')) {
        return;
    } else {
        vistaAñadirProductos.classList.add('active');
    }
    establecerFocus();
});

const establecerFocus = () =>{
    if (vistaEditarProductos.classList.contains('active')){
        menuNavEditar.classList.add('active');
        menuNavStock.classList = 'barra-productos-stock'
        menuNavAñadir.classList = 'barra-productos-añadir'
    }
    if(vistaListarProductos.classList.contains('active')) {
        menuNavStock.classList.add('active');
        menuNavEditar.classList = 'barra-productos-editar'
        menuNavAñadir.classList = 'barra-productos-añadir'
    } 
    if (vistaAñadirProductos.classList.contains('active')) {
        menuNavAñadir.classList.add('active');
        menuNavStock.classList = 'barra-productos-stock'
        menuNavEditar.classList = 'barra-productos-editar'
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////



document.addEventListener('DOMContentLoaded', () =>{
    
    cargarProductos();    
    establecerFocus();
})

btnE_Buscar.addEventListener('click', () =>{
    if (formBusqueda.querySelector('input').value !== '') {
        const id = formBusqueda.querySelector('input').value;
        cargarProductoID(id);
    }
    
});

formBusqueda.addEventListener('keypress', (e) => {
    if (e.key === 'Enter'){
        if (formBusqueda.querySelector('input').value !== '') {
            const id = formBusqueda.querySelector('input').value;
            cargarProductoID(id);
        }
    }
});

formImg_E.addEventListener('change', () => {
    const imgActual = document.querySelector('.img-actual').querySelector('img')
    const newImg = URL.createObjectURL(formImg_E.files[0])
    imgActual.setAttribute('src', newImg)
});

formImg_A.addEventListener('change', () => {
    const imgProducto = document.querySelector('.img-producto').querySelector('img')
    const newImg = URL.createObjectURL(formImg_A.files[0])
    imgProducto.setAttribute('src', newImg)
});

btnE_Enviar.addEventListener('click', () => {
    actualizandoDatos();

    tablaProductos.innerHTML = '';
    vistaEditarProductos.classList.remove('active');
    vistaListarProductos.classList.add('active');
    barraEdicion.classList.remove('active')
    formBusqueda.querySelector('input').value = ''
    establecerFocus();
});

btnA_Enviar.addEventListener('click', () => {
    const formData = new FormData(formAñadir);
    const name = formData.get('nombre');
    const descripcion = formData.get('descripcion');
    const categoria = formData.get('categoria');
    const colores = formData.get('colores');
    const estado = formData.get('estado');
    const precio = formData.get('precio');
    const stock = formData.get('stock');
    const img = formData.get('img');
    
    if (name !== '' && descripcion !== '' && categoria !== '' && colores !== '' && estado !== '' && precio !== '' && stock !== '' && img.size !== 0) {
        creandoProductos();        
        tablaProductos.innerHTML = '';
        vistaAñadirProductos.classList.remove('active');
        vistaListarProductos.classList.add('active');
        limpiarForm();
        establecerFocus();
    } else {
        alert('Todos los campos son obligatorios');
    }

});

const limpiarForm = () => {
    formAñadir.querySelector('#nombre-A').value = ''
    formAñadir.querySelector('#descripcion-A').value = ''
    formAñadir.querySelector('#categoria-A').value = ''
    formAñadir.querySelector('#colores-A').value = ''
    formAñadir.querySelector('#estado-A').value = ''
    formAñadir.querySelector('#precio-A').value = ''
    formAñadir.querySelector('#stock-A').value = ''
    formAñadir.querySelector('#img-A').value = ''
    formAñadir.querySelector('img').removeAttribute('src');
}

btn_Eliminar.addEventListener('click', () => {
    eliminarProducto();

    tablaProductos.innerHTML = '';
    vistaEditarProductos.classList.remove('active');
    vistaListarProductos.classList.add('active');
    establecerFocus();
});

const eliminarProducto = async() => {
    try {
        const res = await fetch(`/api/productos/eliminar/${idProducto}`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': window.CSRF_TOKEN,
                'Authorization': `Token ${window.API_TOKEN}`
            }
        });
        cargarProductos();
    } catch (error) {
        console.log(error)
    }
}

const creandoProductos = () => {
    const formData = new FormData(formAñadir);
    subiendoProductos('crear', formData);
}

const actualizandoDatos = () =>{
    const formData = new FormData(formEditar);
    const img = formData.get('img')
    
    subiendoProductos('editar', formData);
}

const subiendoProductos = (orden, formData) => {
    if (orden === 'editar') {
        const subir = async() =>{
            try {
                const res = await fetch(`/api/productos/editar/${idProducto}`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRFToken': window.CSRF_TOKEN,
                        'Authorization': `Token ${window.API_TOKEN}`
                    }
    
                });

                cargarProductos();
                  
            } catch (error) {
                console.log(error)
            }

        }
        subir();
    } else if (orden === 'crear') {
        const subir = async() =>{
            try {
                const res = await fetch(`/api/productos/crear/`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRFToken': window.CSRF_TOKEN,
                        'Authorization': `Token ${window.API_TOKEN}`
                    }
                });

                cargarProductos();

            } catch (error) {
                console.log(error)
            }
        }
        subir();
    }
}

const cargarProductoID = async(id) => {
    try {
        const res = await fetch(`/api/productos/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${window.API_TOKEN}`
            }
        });
        const data = await res.json()
        if (data.message === 'Success') {
            const producto = await data.producto
            busquedaEditar(producto);
        } else {
            msgNoEncontrado.classList.add('active')
            barraEdicion.classList.remove('active')
        }
        
        
    } catch (error) {
        console.log(error)
    }
}

const busquedaEditar = (producto) =>{
    formEditar.querySelector('#nombre-E').value = producto.nombre
    formEditar.querySelector('#descripcion-E').value = producto.descripcion
    formEditar.querySelector('#categoria-E').value = producto.categoria
    formEditar.querySelector('#colores-E').value = producto.colores
    formEditar.querySelector('#estado-E').value = producto.estado
    formEditar.querySelector('#precio-E').value = producto.precio
    formEditar.querySelector('#stock-E').value = producto.stock    
    formEditar.querySelector('.img-actual').querySelector('img').setAttribute('src', URLServer + "/" + producto.imagen)     
    
    idProducto = producto.id
    barraEdicion.classList.add('active')
    msgNoEncontrado.classList.remove('active')

}

const cargarProductos = async() => {
    try {
        const res = await fetch(`/api/productos/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${window.API_TOKEN}`
            }
        })
        const data = await res.json()
        const productos = await data.productos
        
        pintarProductos(productos);
        
    } catch (error) {
        console.log(error)
    }
}

const pintarProductos = (productos) => {
    const tabla = document.createElement('table');
    const trPrincipal = document.createElement('tr');
    let thID = document.createElement('th');
    let thNombre = document.createElement('th');
    let thPrecio = document.createElement('th');
    let thStock = document.createElement('th');

    let tdID = document.createElement('td');
    let tdNombre = document.createElement('td');
    let tdPrecio = document.createElement('td');
    let tdStock = document.createElement('td');

    thID.textContent = 'ID'
    thNombre.textContent = 'Nombre'
    thPrecio.textContent = 'Precio'
    thStock.textContent = 'Stock'
    trPrincipal.appendChild(thID); trPrincipal.appendChild(thNombre); trPrincipal.appendChild(thPrecio); trPrincipal.appendChild(thStock);

    tabla.appendChild(trPrincipal);
    

    productos.forEach(producto => {
        // productosDiv.innerHTML = `<tr> <td>${producto.id}</td> <td>${producto.nombre}</td> <td>${producto.precio}</td> <td>${producto.stock}</td> </tr>`
        const trSecundario = document.createElement('tr');

        tdID.textContent = producto.id
        tdNombre.textContent = producto.nombre
        tdPrecio.textContent = producto.precio
        tdStock.textContent = producto.stock

        trSecundario.appendChild(tdID); trSecundario.appendChild(tdNombre); trSecundario.appendChild(tdPrecio); trSecundario.appendChild(tdStock);
        const clone2 = trSecundario.cloneNode(true)

        tabla.appendChild(clone2);
    })
    

    tabla.setAttribute('border', '1')
    tabla.setAttribute('width', '80%')
    tabla.setAttribute('cellpadding', '0')
    tabla.setAttribute('cellspacing', '0')
    tablaProductos.appendChild(tabla);
}