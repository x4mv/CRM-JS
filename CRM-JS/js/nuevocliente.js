(function(){
// variables
let DB;
const formulario = document.querySelector('#formulario');

//const agregarClienteBtn = document.querySelector("input[type='submit']");


document.addEventListener('DOMContentLoaded',() =>{ 
        
    conectarDB();
    formulario.addEventListener('submit', crearCliente);
    
}) 



// funciones 
function crearCliente(e) {
    e.preventDefault();

    // extrayendo los valores de los inputs a la hora de enviar el formulario 
    const nombre = document.querySelector('#nombre').value;
    const email = document.querySelector('#email').value;
    const telefono = document.querySelector('#telefono').value;
    const empresa = document.querySelector('#empresa').value;
    const id = Date.now();

    // validando que telefono sea un numero 
    if (isNaN(telefono)){
        mostrarAlertas('El telefono no es valido', 'error');
        return;
    }
    // validar que no se dejen espacios en blanco
    if ( nombre.trim() === '' || email.trim() === '' || telefono.trim() === '' || empresa.trim() === ''){
        mostrarAlertas('Todos los campos son obligatorios', 'error');
        return;
    }

    const cliente = {
        nombre,
        email,
        telefono,
        empresa
    }
    cliente.id =  Date.now();


    //agregando cliente a la DB
    agregarCliente(cliente);


    //resetear el formulario a la hora de enviar 
    formulario.reset();

}




function agregarCliente(cliente){

    const transaction = DB.transaction(['CRM'], 'readwrite');
    const objectStore = transaction.objectStore('CRM');

    objectStore.add(cliente);

    transaction.onerror = () => {
        console.log('transaccion fallida ');
    }

    transaction.oncomplete = () => {
        // mostrando que se guardo con exito
        mostrarAlertas('Cliente guardado correctamente', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    

    }


}


function conectarDB(){
        
    const crmDB = window.indexedDB.open('CRM',1);

    // si hay un error
    crmDB.onerror = () =>{
        console.log('Error al crear la base de datos')
    }

    // si se completa correctamente
    crmDB.onsuccess = () => {
        console.log('DB creada')

        DB = crmDB.result;
        
    }
}



})();