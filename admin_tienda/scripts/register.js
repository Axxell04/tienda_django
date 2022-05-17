const formRegister = document.querySelector('#form-register');
const btnRegister = document.querySelector('#btn-register');

btnRegister.addEventListener('click', (e) => {
    if (formRegister.querySelector('#username').value !== '' && formRegister.querySelector('#password').value !== '' && formRegister.querySelector('#password-confirm').value !== '') {
        if (formRegister.querySelector('#password').value === formRegister.querySelector('#password-confirm').value) {
            registrarUsuario();
            
        } else {
            setTimeout(() => {
                formRegister.querySelector('.form-contraseña-confirm').querySelector('span').classList = 'active';
            }, 100);
            setTimeout(() => {
                formRegister.querySelector('.form-contraseña-confirm').querySelector('span').classList = '';
            }, 2000);
        }
        
    } else {
        alert('Por favor rellene todos los campos');
    }
});


const registrarUsuario = async() => {
    const formData = new FormData(formRegister);
    try {
        const res = await fetch('/api/register/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': window.CSRF_TOKEN,
                'Authorization': `Token ${window.API_TOKEN}`
            }

        })
        window.location.href = '/admin/';

        
    } catch (error) {
        console.log(error);
    }
}