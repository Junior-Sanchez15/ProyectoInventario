//Cargar Datos
let categoriaEditar = obtenerDatos("categoriaEditar", "objeto");

if(categoriaEditar){
    document.getElementById("nombreCategoria").value = categoriaEditar.nombre;
    document.getElementById("descripcionCategoria").value = categoriaEditar.descripcion;
}

//Formularios
const formulario = document.getElementById("formCategoria");
const mensaje = document.getElementById("mensajeCategoria");

formulario.addEventListener("submit", function(e){

    e.preventDefault();

    const nombre = document.getElementById("nombreCategoria").value;
    const descripcion = document.getElementById("descripcionCategoria").value;

    // Validaciones
    if(nombre === "" || descripcion === ""){
        mensaje.innerHTML = "❌ Todos los campos son obligatorios";
        mensaje.classList.add("mensaje-error");
        return;
    }

    if(nombre.length < 3){
        mensaje.innerHTML = "❌ El nombre debe tener al menos 3 caracteres";
        return;
    }

    if(descripcion.length < 5){
        mensaje.innerHTML = "❌ La descripción es muy corta";
        return;
    }

    const categoria = { nombre, descripcion };
    
    let categorias = obtenerDatos("categorias");

    if(localStorage.getItem("categoriaEditar")){

        let index = categorias.findIndex(c => c.nombre === categoriaEditar.nombre);

        if(index !== -1){
            categorias[index] = categoria;
        }

        localStorage.removeItem("categoriaEditar");

        if(typeof guardarActividad === "function"){
            guardarActividad("✏️ Categoría editada: " + nombre);
        }

    }else{

        categorias.push(categoria);

        if(typeof guardarActividad === "function"){
            guardarActividad("✔ Categoría agregada: " + nombre);
        }
    }

    localStorage.setItem("categorias", JSON.stringify(categorias));

    mensaje.innerHTML = "✅ Categoría guardada correctamente";
    mensaje.classList.remove("mensaje-error");
    mensaje.classList.add("mensaje-exito");

    formulario.reset();

    setTimeout(() => {
        location.reload();
    }, 800);

}); // ✅ 🔥 ESTE ERA EL CIERRE QUE FALTABA


//Mostrar Categorias
const tablaCategorias = document.getElementById("tablaCategorias");

let categorias = obtenerDatos("categorias");

if(tablaCategorias){

    let contenido = "";

    categorias.forEach((cat, index) => {

        contenido += `
            <tr>
                <td>${index + 1}</td>
                <td>${cat.nombre}</td>
                <td>${cat.descripcion}</td>
                <td>
                    <button class="btn-editar" onclick="editarCategoria(${index})">Editar</button>
                    <button class="btn-eliminar" onclick="eliminarCategoria(${index})">Eliminar</button>
                </td>
            </tr>
        `;

    });

    tablaCategorias.innerHTML = contenido;
}

//Eliminar
function eliminarCategoria(index){

    let categorias = obtenerDatos("categorias");

    categorias.splice(index, 1);

    localStorage.setItem("categorias", JSON.stringify(categorias));

    if(typeof guardarActividad === "function"){
        guardarActividad("❌ Categoría eliminada");
    }

    location.reload();
}

//Editar
function editarCategoria(index){

    let categorias = obtenerDatos("categorias");

    let categoria = categorias[index];

    localStorage.setItem("categoriaEditar", JSON.stringify(categoria));

    location.reload();
}

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