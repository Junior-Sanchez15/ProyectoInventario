// Lógica de Inventario (inventario.js)

document.addEventListener("DOMContentLoaded", () => {
    let productos = obtenerDatos("productos");

    // Si no hay Productos → Resetea Ventas
    if (productos.length === 0) {
        guardarDatos("totalVentasCantidad", 0);
        guardarDatos("totalVentasDinero", 0);
        guardarDatos("ventas", []);
    }

    // Tabla de Inventario
    const tabla = document.getElementById("tablaInventario");
    let bajos = 0;
    let agotados = 0;

    if (tabla) {
        tabla.innerHTML = "";

        if (productos.length === 0) {
            tabla.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--text-muted);">El inventario está vacío.</td></tr>`;
        } else {
            productos.forEach((producto, index) => {
                let estado = "";
                let bgState = "";
                let colorState = "";

                if (producto.cantidad === 0) {
                    estado = "Agotado";
                    bgState = "rgba(239, 68, 68, 0.1)"; // danger light
                    colorState = "var(--danger-color)";
                    agotados++;
                } else if (producto.cantidad <= 5) {
                    estado = "Stock Bajo";
                    bgState = "rgba(245, 158, 11, 0.1)"; // warning light
                    colorState = "#f59e0b"; // amber
                    bajos++;
                } else {
                    estado = "Disponible";
                    bgState = "rgba(16, 185, 129, 0.1)"; // success light
                    colorState = "var(--secondary-color)";
                }

                const badge = `<span style="background: ${bgState}; color: ${colorState}; padding: 4px 10px; border-radius: 6px; font-size: 0.85rem; font-weight: 600;">${estado}</span>`;

                const fila = `
                    <tr>
                        <td>${index + 1}</td>
                        <td><strong>${producto.nombre}</strong></td>
                        <td style="font-weight: bold; font-size: 1.1rem;">${producto.cantidad}</td>
                        <td>${badge}</td>
                    </tr>
                `;
                tabla.innerHTML += fila;
            });
        }
    }

    // Actualizar Cards
    const productosBajos = document.getElementById("productosBajos");
    const productosAgotados = document.getElementById("productosAgotados");
    const totalVentasCard = document.getElementById("totalVentas");

    if (productosBajos) productosBajos.innerHTML = `${bajos}`;
    if (productosAgotados) productosAgotados.innerHTML = `${agotados}`;

    let totalVentasCantidad = obtenerDatos("totalVentasCantidad", "numero") || 0;
    if (totalVentasCard) totalVentasCard.innerHTML = `${totalVentasCantidad}`;

});