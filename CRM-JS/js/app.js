(function() {
    
    const tbody = document.querySelector('#listado-clientes')
    
    let DB;

    // eventlisteners 

    document.addEventListener('DOMContentLoaded', ()=> {
        crearDB();

        if (window.indexedDB.open('CRM',1)){
            obtenerClientes();
        }
    })
    // funcion para crear la BD 

    function crearDB(){
        
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

        
        //configurando la DB
        crmDB.onupgradeneeded = (e) => {
            const db = e.target.result;

            const objectStore = db.createObjectStore('CRM', {
                KeyPath: 'id',
                autoIncrement: true
            });


            // creando el schema
            objectStore.createIndex('cliente','cliente', {unique : false});
            objectStore.createIndex('email','email', {unique : true});
            objectStore.createIndex('telefono','telefono', {unique : false});
            objectStore.createIndex('empresa','empresa', {unique : false});
            objectStore.createIndex('id','id', {unique : true});

            console.log('Columnas Creadas');
        }
    }


    function obtenerClientes(){

        const abrirConexion = window.indexedDB.open('CRM', 1);

        abrirConexion.onerror = () => {
            console.log('hubo un error en abrir conexion')
        }

        abrirConexion.onsuccess = () => {
            DB = abrirConexion.result;

            const objectStore = DB.transaction('CRM').objectStore('CRM');


            objectStore.openCursor().onsuccess = function (e){
                const cursor = e.target.result;

                if (cursor){
                    console.log(cursor.value)
                    const {nombre, email, telefono, empresa, id } = cursor.value;
                    tbody.innerHTML += ` 
                <tr>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                        <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                        <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                        <p class="text-gray-700">${telefono}</p>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                        <p class="text-gray-600">${empresa}</p>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                        <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                        <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900">Eliminar</a>
                    </td>
                </tr>
                `;
                    cursor.continue();
                }else{
                    console.log('aun no hay registros')
                }

        }

        

        }
    }
    
})();


