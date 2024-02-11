let DB;
function mostrarAlertas(mensaje, tipo){

    const divAlerta = document.createElement('DIV');
    

    if (tipo === 'error'){
        divAlerta.classList.add("bg-red-600", "text-white", "px-2", "py-2", "text-center", "m-4")
    }else{
        divAlerta.classList.add("bg-green-600","text-white", "px-2", "py-2", "text-center", "m-4");
    }

    divAlerta.textContent = mensaje;

    formulario.appendChild(divAlerta);

    setTimeout(() => {
        divAlerta.remove()
    }, 3000);
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