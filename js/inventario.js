//obtener datos
let productos = obtenerDatos("productos");

//Si no hay Productos → Resetea Ventas
if(productos.length === 0){

    localStorage.setItem("totalVentasCantidad", JSON.stringify(0));
    localStorage.setItem("totalVentasDinero", JSON.stringify(0));
    localStorage.setItem("ventas", JSON.stringify([]));

}

// Tabla
const tabla = document.getElementById("tablaInventario");

let bajos = 0;
let agotados = 0;

if(tabla){

    tabla.innerHTML = "";

    productos.forEach((producto, index) => {

        let estado = "";
        let clase = "";

        if(producto.cantidad === 0){
            estado = "Agotado";
            clase = "color-rojo";
            agotados++;
        }else if(producto.cantidad <= 5){
            estado = "Stock Bajo";
            clase = "color-naranja";
            bajos++;
        }else{
            estado = "Disponible";
            clase = "color-verde";
        }

        const fila = `
            <tr>
                <td>${index + 1}</td>
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td class="${clase}">${estado}</td>
            </tr>
        `;

        tabla.innerHTML += fila;

    });

}

//Actualizar Cards
const productosBajos = document.getElementById("productosBajos");
const productosAgotados = document.getElementById("productosAgotados");
const totalVentasCard = document.getElementById("totalVentas");

if(productosBajos){
    productosBajos.innerHTML = `${bajos} productos`;
}

if(productosAgotados){
    productosAgotados.innerHTML = `${agotados} productos`;
}

let totalVentasCantidad = obtenerDatos("totalVentasCantidad", "numero") || 0;

if(totalVentasCard){
    totalVentasCard.innerHTML = `${totalVentasCantidad} ventas`;
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