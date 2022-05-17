const contenedorUsers = document.getElementById('contenedor-users');
const templateUser = document.getElementById('template-user').content;

contenedorUsers.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-user-delete')) {
        const id = e.target.dataset.id;
        eliminarUsuario(id);
    }
})


document.addEventListener('DOMContentLoaded', () => {
    cargarUsuarios();
})

const cargarUsuarios = async() => {
    try {
        const res = await fetch('/api/users/0', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${window.API_TOKEN}`
            }
        })
        const data = await res.json()
        pintarUsuarios(data.users);
        console.log(data.users)
    } catch (error) {
        console.log(error)
    }
}

const pintarUsuarios = (data) => {
    contenedorUsers.innerHTML = '';
    let fragmentUsers = document.createElement('ul');
    data.forEach(user => {
        templateUser.querySelector('.user-name').innerHTML = user.username;
        if(user.last_login !== null){
            last_login = user.last_login.split('T')[0];
            templateUser.querySelector('.user-UC').innerHTML = last_login;
        } else {
            templateUser.querySelector('.user-UC').innerHTML = 'No ha iniciado sesión';
        }
        templateUser.querySelector('.btn-user-delete').dataset.id = user.id;
        if (user.is_superuser) {
            templateUser.querySelector('.user-rango').innerHTML = 'Administrador';
        } else {
            templateUser.querySelector('.user-rango').innerHTML = 'Personal';
        }
        fragmentUsers.appendChild(templateUser.cloneNode(true));
    })
    contenedorUsers.appendChild(fragmentUsers);
}

const eliminarUsuario = async(id) => {
    try {
        const res = await fetch(`/api/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': window.CSRF_TOKEN,
                'Authorization': `Token ${window.API_TOKEN}`
            }
        })
        const data = await res.json()
        console.log(data)
        // window.location.reload();
        await cargarUsuarios();
    } catch (error) {
        console.log(error)
    }
}