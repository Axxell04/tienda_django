const lengthNum = (num) => {
    return num.toString().length
}

const pintarNumCarrito = (num) => {
    if(num) {

        carritoNum.innerHTML = `<h6>${num}</h6>`
        carritoNum.className = 'carritoNum'         

        if (lengthNum(num) === 1) {
            carritoNum.querySelector('h6').style.width = '25px'
        } else if (lengthNum(num) === 2) {
            carritoNum.querySelector('h6').style.width = '30px'
        }
        
    } else {
        carritoNum.innerHTML = ''
        // carritoNum.className = ''
    }
    
    
}

const pintarNav = () => {
    const nav = document.querySelector('#navegacion')
    if (window.screen.width < 600 | window.innerWidth < 600) {
        // nav.className = 'nav-movil-oculta'
        // pintarNumCarrito(numCarrito.numero);

        
        
    } else if (window.screen.width >= 600 | window.innerWidth >= 600) {
        nav.className = 'nav-pc'
        // pintarNumCarrito(numCarrito.numero);
        
    }
}

// import Hammer from "https://cdn.skypack.dev/hammerjs@2.0.8";
// import hammer from 'https://cdn.skypack.dev/hammerjs';

// HAMMER //////////////////////////
// let hammerr = new hammer(document.body)
// const hammerNav = new hammer(document.getElementById('navegacion'))
// try {
//     const hammerForm = new hammer(document.getElementById('form'))

//     hammerForm.get('pan').set({ direction: Hammer.DIRECTION_ALL });
// } catch {

// }

// //Funcion que bloquea el scroll de dispositivos moviles

// hammerNav.get('pan').set({ direction: Hammer.DIRECTION_ALL });


// hammerr.on('swipeleft', () => {
//     const nav = document.querySelector('#navegacion')
    
//     if (window.screen.width < 600 | window.innerWidth < 600) {
//         // nav.classList.toggle('active');
//         nav.className = 'active';

//     }
// })

// hammerr.on('swiperight', () => {
//     const nav = document.querySelector('#navegacion')
//     if (window.screen.width < 600 | window.innerWidth < 600) {

//         nav.className = '';

//     }
// })

