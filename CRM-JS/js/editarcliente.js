(function(){
    // variables
    let DB;
    let idCliente;
    const formulario = document.querySelector('#formulario');
    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');
    

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        
        // Obtener los datos del cliente, Extraer su ID de la URL 
        const parametrosURL = new URLSearchParams(window.location.search);
        idCliente = parametrosURL.get('id')
        if (idCliente){
            setTimeout(() => {
                obtenerCliente(idCliente)
            }, 1000);
        }        
        
        formulario.addEventListener('submit', actualizarCliente);
        
        
    })

    function actualizarCliente(e){
        e.preventDefault();

        // validar que no se dejen espacios en blanco
        if ( nombreInput.value.trim() === '' || emailInput.value.trim() === '' || telefonoInput.value.trim() === '' || empresaInput.value.trim() === ''){
            mostrarAlertas('Todos los campos son obligatorios', 'error');
            return;
        }

        
         // actualizar...
        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            empresa: empresaInput.value,
            telefono: telefonoInput.value,
            id: Number(idCliente) 
        };
        console.log('actualizado ',clienteActualizado)

        const transaction = DB.transaction(['CRM'], 'readwrite');
        const objectStore = transaction.objectStore('CRM');

        
        objectStore.put(clienteActualizado);

        transaction.oncomplete = () => {
            console.log('editado correctamente')
        }

        transaction.onerror = (error) => {
            console.log(error)
            console.log('hubo un error')
        }

        
        

    }

    function obtenerCliente(id){

        const transaction = DB.transaction(['CRM'], 'readwrite');
        const objectStore = transaction.objectStore('CRM')
        

        const cliente = objectStore.openCursor();
        cliente.onsuccess = (e) => {
            const cursor = e.target.result;

            if (cursor){
                if (cursor.value.id === Number(id)){
                    rellenarCampos(cursor.value)
                }
                cursor.continue()
            }
        }

    }

    // funcion para rellenar los campos 
    function rellenarCampos(obj){
        const {nombre, email, telefono, empresa} = obj
        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
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