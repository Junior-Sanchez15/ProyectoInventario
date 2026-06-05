// Lógica de Ventas (ventas.js)

document.addEventListener("DOMContentLoaded", () => {
    const precioInput = document.getElementById("precioProducto");
    const totalInput = document.getElementById("totalVenta");
    const cantidadInput = document.getElementById("cantidadVenta");
    const select = document.getElementById("productoVenta");
    const btnVender = document.getElementById("btnVender");

    let productos = obtenerDatos("productos");

    // Llenar Select
    if (productos.length === 0) {
        select.innerHTML = `<option value="">No hay productos disponibles</option>`;
        cantidadInput.disabled = true;
        if (btnVender) btnVender.disabled = true;
    } else {
        productos.forEach((p) => {
            const option = document.createElement("option");
            option.value = p.id;
            // Deshabilitar si no hay stock
            if (p.cantidad <= 0) {
                option.textContent = `${p.nombre} (Sin Stock)`;
                option.disabled = true;
            } else {
                option.textContent = `${p.nombre} (Stock: ${p.cantidad})`;
            }
            select.appendChild(option);
        });
    }

    // Mostrar Precio
    function actualizarPrecio() {
        if (select.value === "") return;
        
        let id = select.value;
        let producto = productos.find(p => p.id === id);

        if (!producto) return;

        precioInput.value = `$${parseFloat(producto.precio).toFixed(2)}`;
        calcularTotal();
    }

    // Calcular Total
    function calcularTotal() {
        if (select.value === "") return;

        let id = select.value;
        let producto = productos.find(p => p.id === id);
        let cantidad = parseInt(cantidadInput.value);

        if (!producto || isNaN(cantidad)) {
            totalInput.value = "";
            return;
        }

        let total = producto.precio * cantidad;
        totalInput.value = `$${total.toFixed(2)}`;
    }

    if (select) select.addEventListener("change", actualizarPrecio);
    if (cantidadInput) cantidadInput.addEventListener("input", calcularTotal);

    // Formulario de Venta
    const form = document.getElementById("formVenta");

    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            
            if (select.value === "") {
                showToast("Por favor, selecciona un producto", "error");
                return;
            }

            let id = select.value;
            let cantidad = parseInt(cantidadInput.value);

            if (isNaN(cantidad) || cantidad <= 0) {
                showToast("La cantidad debe ser mayor a 0", "error");
                return;
            }

            let index = productos.findIndex(p => p.id === id);
            let producto = productos[index];

            if (!producto) return;

            if (producto.cantidad < cantidad) {
                showToast(`Stock insuficiente. Solo quedan ${producto.cantidad} unidades.`, "error");
                return;
            }

            let total = producto.precio * cantidad;

            // Confirmar venta
            showConfirmDialog(`Confirmar venta de <strong>${cantidad}x ${producto.nombre}</strong> por <strong>$${total.toFixed(2)}</strong>`, () => {
                
                // Total dinero
                let totalVentasDinero = obtenerDatos("totalVentasDinero", "numero") || 0;
                totalVentasDinero += total;
                guardarDatos("totalVentasDinero", totalVentasDinero);

                // Total cantidad
                let totalVentasCantidad = obtenerDatos("totalVentasCantidad", "numero") || 0;
                totalVentasCantidad += cantidad;
                guardarDatos("totalVentasCantidad", totalVentasCantidad);

                // Restar stock
                producto.cantidad -= cantidad;
                guardarDatos("productos", productos);

                // Guardar venta
                let ventas = obtenerDatos("ventas");
                ventas.push({
                    producto: producto.nombre,
                    cantidad: cantidad,
                    precio: producto.precio,
                    total: total,
                    fecha: new Date().toLocaleString()
                });
                guardarDatos("ventas", ventas);

                if (typeof guardarActividad === "function") {
                    guardarActividad(`✔ Venta: ${producto.nombre} x${cantidad} ($${total.toFixed(2)})`);
                }

                showToast("Venta realizada con éxito", "exito");

                // Recargar después de mostrar el toast
                setTimeout(() => location.reload(), 1500);
            });
        });
    }

    // Inicializar
    if (cantidadInput) cantidadInput.value = 1;
    actualizarPrecio();
    calcularTotal();
});