//Datos Seguros
let productos = obtenerDatos("productos");
let categorias = obtenerDatos("categorias");

//Tabla Productos
const tabla = document.getElementById("tablaProductos");

if(tabla){

    tabla.innerHTML = ""; //Limpiar antes

    productos.forEach(function(producto, index){

        const fila = `
            <tr>
                <td>${index + 1}</td>
                <td>${producto.nombre}</td>
                <td>${producto.categoria}</td>
                <td>$${producto.precio}</td>
                <td>${producto.cantidad}</td>
                <td>
                    <button class="btn-editar" onclick="editarProducto(${index})">Editar</button>
                    <button class="btn-eliminar" onclick="eliminarProducto(${index})">Eliminar</button>
                </td>
            </tr>
        `;

        tabla.innerHTML += fila;

    });

}

//Eliminar Productos
function eliminarProducto(index){

    productos.splice(index, 1);

    localStorage.setItem("productos", JSON.stringify(productos));

    //Protegido
    if(typeof guardarActividad === "function"){
        guardarActividad("❌ Producto eliminado");
    }

    location.reload();

}

//Editar Producto
function editarProducto(index){

    let producto = productos[index];

    localStorage.setItem("productoEditar", JSON.stringify(producto));

    window.location.href = "productos.html";

}

//Dashboard (Cards)
const totalProductos = document.getElementById("totalProductos");
const totalCategorias = document.getElementById("totalCategorias");
const totalStock = document.getElementById("totalStock");

// Total Productos
if(totalProductos){
    totalProductos.innerHTML = `${productos.length} productos`;
}

// Total Categorías
if(totalCategorias){
    totalCategorias.innerHTML = `${categorias.length} categorías`;
}

// Total Stock
let sumaStock = 0;

productos.forEach(producto => {
    sumaStock += Number(producto.cantidad);
});

if(totalStock){
    totalStock.innerHTML = `${sumaStock} unidades`;
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