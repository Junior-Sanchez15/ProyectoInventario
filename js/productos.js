//Llenar Select de Categorias
const selectCategoria = document.getElementById("categoriaProducto");

let categorias = obtenerDatos("categorias");

categorias.forEach(function(cat){

    const opcion = document.createElement("option");

    opcion.value = cat.nombre;
    opcion.textContent = cat.nombre;

    selectCategoria.appendChild(opcion);

});

//Cargar Producto para editar
let productoEditar = obtenerDatos("productoEditar", "objeto");

if(productoEditar){

    document.getElementById("nombreProducto").value = productoEditar.nombre;
    selectCategoria.value = productoEditar.categoria;
    document.getElementById("precioProducto").value = productoEditar.precio;
    document.getElementById("cantidadProducto").value = productoEditar.cantidad;
    document.getElementById("descripcionProducto").value = productoEditar.descripcion;

}

//Formulario
const formulario = document.getElementById("formProducto");
const mensaje = document.getElementById("mensajeProducto");

formulario.addEventListener("submit", function(event){

    event.preventDefault();

    const nombre = document.getElementById("nombreProducto").value;
    const categoria = document.getElementById("categoriaProducto").value;
    const precio = parseFloat(document.getElementById("precioProducto").value);
    const cantidad = parseInt(document.getElementById("cantidadProducto").value);
    const descripcion = document.getElementById("descripcionProducto").value;

    //Validacion
    if(
        nombre === "" ||
        categoria === "" ||
        isNaN(precio) ||
        isNaN(cantidad) ||
        descripcion === ""
    ){

        mensaje.innerHTML = "❌ Todos los campos son obligatorios";
        mensaje.classList.remove("exito");
        mensaje.classList.add("error");
        return;
    }

    if(nombre.length < 2){

        mensaje.innerHTML = "❌ El nombre debe tener al menos 2 caracteres";
        mensaje.classList.remove("exito");
        mensaje.classList.add("error");
        return;
    }

    if(descripcion.length < 7){

        mensaje.innerHTML = "❌ La descripción debe tener al menos 7 caracteres";
        mensaje.classList.remove("exito");
        mensaje.classList.add("error");
        return;
    }

    if(precio <= 0){

        mensaje.innerHTML = "❌ El precio debe ser mayor que 0";
        mensaje.classList.remove("exito");
        mensaje.classList.add("error");
        return;
    }

    if(cantidad <= 0){

        mensaje.innerHTML = "❌ La cantidad debe ser mayor que 0";
        mensaje.classList.remove("exito");
        mensaje.classList.add("error");
        return;
    }

    //Producto
    const producto = {
        nombre,
        categoria,
        precio,
        cantidad,
        descripcion
    };

    //Local Storage
    let productos = obtenerDatos("productos");

    if(localStorage.getItem("productoEditar")){
        
        let productoEditar = obtenerDatos("productoEditar", "objeto");
        let index = productos.findIndex(p => p.nombre === productoEditar.nombre);

        productos[index] = producto;

        localStorage.removeItem("productoEditar");

        //Actividad
        if(typeof guardarActividad === "function"){
            guardarActividad("✏️ Producto editado: " + nombre);
        }

    }else{

        productos.push(producto);

        if(typeof guardarActividad === "function"){
            guardarActividad("✔ Producto agregado: " + nombre);
        }

    }

    localStorage.setItem("productos", JSON.stringify(productos));

    //Mensaje Final
    mensaje.innerHTML = "✅ Producto guardado correctamente";
    mensaje.classList.remove("error");
    mensaje.classList.add("exito");

    formulario.reset();

});

//Actividad Reciente
const listaActividad = document.getElementById("listaActividad");

let actividad = obtenerDatos("actividad");

if(listaActividad){

    let contenido = "";

    actividad.forEach(item => {

        let clase = "";
        
        if(item.includes("✔")){
            clase = "ok";
        }else if(item.includes("✏️")){
            clase = "edit";
        }else if(item.includes("❌")){
            clase = "delete";
        }

        contenido += `<li class="${clase}">${item}</li>`;

    });

    listaActividad.innerHTML = contenido;

}