const precioInput = document.getElementById("precioProducto");
const totalInput = document.getElementById("totalVenta");
const cantidadInput = document.getElementById("cantidadVenta");

let productos = obtenerDatos("productos");

// Select
const select = document.getElementById("productoVenta");

if(productos.length === 0){

    // Resetear ventas
    localStorage.setItem("totalVentasCantidad", JSON.stringify(0));
    localStorage.setItem("totalVentasDinero", JSON.stringify(0));
    localStorage.setItem("ventas", JSON.stringify([]));

    // Bloquear interfaz
    select.innerHTML = `<option>No hay productos disponibles</option>`;
    cantidadInput.disabled = true;

}else{

    // Solo si hay producto
    productos.forEach((p, index) => {

        const option = document.createElement("option");

        option.value = index;
        option.textContent = `${p.nombre} (Stock: ${p.cantidad})`;

        select.appendChild(option);

    });

}


//Mostrar Precio
function actualizarPrecio(){

    let index = parseInt(select.value);
    let producto = productos[index];

    if(!producto) return;

    precioInput.value = producto.precio;

    calcularTotal();
}

select.addEventListener("change", actualizarPrecio);


//Calcular Total
function calcularTotal(){

    let index = parseInt(select.value);
    let producto = productos[index];

    let cantidad = parseInt(cantidadInput.value);

    if(!producto || isNaN(cantidad)){
        totalInput.value = "";
        return;
    }

    let total = producto.precio * cantidad;

    totalInput.value = `$${total}`;
}

cantidadInput.addEventListener("input", calcularTotal);


//Formulario
const form = document.getElementById("formVenta");
const mensaje = document.getElementById("mensajeVenta");

form.addEventListener("submit", function(e){

    e.preventDefault();
    
    let index = parseInt(select.value);
    let cantidad = parseInt(cantidadInput.value);

    if(isNaN(cantidad) || cantidad <= 0){
        mensaje.innerHTML = "❌ Cantidad inválida";
        return;
    }

    let producto = productos[index];

    if(producto.cantidad < cantidad){
        mensaje.innerHTML = "❌ No hay suficiente stock";
        return;
    }

    let total = producto.precio * cantidad;

    //Total dinero
    let totalVentasDinero = obtenerDatos("totalVentasDinero", "numero") || 0;
    totalVentasDinero += total;
    localStorage.setItem("totalVentasDinero", JSON.stringify(totalVentasDinero));

    //Total cantidad
    let totalVentasCantidad = obtenerDatos("totalVentasCantidad", "numero") || 0;
    totalVentasCantidad += cantidad;
    localStorage.setItem("totalVentasCantidad", JSON.stringify(totalVentasCantidad));

    // Restar stock
    producto.cantidad -= cantidad;

    localStorage.setItem("productos", JSON.stringify(productos));

    //Guardar venta
    let ventas = obtenerDatos("ventas");

    ventas.push({
        producto: producto.nombre,
        cantidad: cantidad,
        precio: producto.precio,
        total: total,
        fecha: new Date().toLocaleString()
    });

    localStorage.setItem("ventas", JSON.stringify(ventas));

    guardarActividad(`🛒 Venta: ${producto.nombre} x${cantidad} ($${total})`);

    mensaje.innerHTML = "✅ Venta realizada";

    location.reload();

});

//Inicializar
cantidadInput.value = 1;
actualizarPrecio();
calcularTotal();

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