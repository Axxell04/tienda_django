const formLogin = document.querySelector('#form-login');
const btnLogin = document.querySelector('#btn-login');

btnLogin.addEventListener('click', (e) => {
    if (formLogin.querySelector('#username').value !== '' && formLogin.querySelector('#password').value !== '') {
        // alert('Iniciando sesión...');
        iniciandoSesion();
        
    } else {
        alert('Por favor rellene todos los campos');
    }
});


const iniciandoSesion = async() => {
    const formData = new FormData(formLogin);
    try {
        const res = await fetch('/accounts/login/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': window.CSRF_TOKEN
            }

        })
        window.location.href = '/admin/';

        
    } catch (error) {
        console.log(error);
    }
}