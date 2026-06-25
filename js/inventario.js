// Lógica de Inventario (inventario.js)

document.addEventListener("DOMContentLoaded", async () => {

    // 🔹 VARIABLES
    let productos = [];
    let ventas = [];

    // 🔹 Cargar productos desde backend
    async function cargarProductos() {
        const res = await fetch("http://localhost:3000/api/productos");
        productos = await res.json();
    }

    // 🔹 Cargar ventas desde backend
    async function cargarVentas() {
        const res = await fetch("http://localhost:3000/api/ventas");
        ventas = await res.json();
    }

    // cargar ambos
    await cargarProductos();
    await cargarVentas();

    // Tabla de Inventario
    const tabla = document.getElementById("tablaInventario");
    let bajos = 0;
    let agotados = 0;

    if (tabla) {
        let htmlContent = "";

        if (productos.length === 0) {
            htmlContent = `<tr><td colspan="4" style="text-align:center; color: var(--text-muted);">El inventario está vacío.</td></tr>`;
        } else {
            productos.forEach((producto, index) => {
                let estado = "";
                let bgState = "";
                let colorState = "";

                if (producto.cantidad === 0) {
                    estado = "Agotado";
                    bgState = "rgba(239, 68, 68, 0.1)";
                    colorState = "var(--danger-color)";
                    agotados++;
                } else if (producto.cantidad <= 5) {
                    estado = "Stock Bajo";
                    bgState = "rgba(245, 158, 11, 0.1)";
                    colorState = "#f59e0b";
                    bajos++;
                } else {
                    estado = "Disponible";
                    bgState = "rgba(16, 185, 129, 0.1)";
                    colorState = "var(--secondary-color)";
                }

                const badge = `<span style="background: ${bgState}; color: ${colorState}; padding: 4px 10px; border-radius: 6px; font-size: 0.85rem; font-weight: 600;">${estado}</span>`;

                htmlContent += `
                    <tr>
                        <td>${index + 1}</td>
                        <td><strong>${escapeHTML(producto.nombre)}</strong></td>
                        <td style="font-weight: bold; font-size: 1.1rem;">${producto.cantidad}</td>
                        <td>${badge}</td>
                    </tr>
                `;
            });
        }

        tabla.innerHTML = htmlContent;
    }

    // 🔹 CARDS
    const productosBajos = document.getElementById("productosBajos");
    const productosAgotados = document.getElementById("productosAgotados");
    const totalVentasCard = document.getElementById("totalVentas");

    if (productosBajos) productosBajos.innerHTML = `${bajos}`;
    if (productosAgotados) productosAgotados.innerHTML = `${agotados}`;

    let totalVentasCantidad = ventas.reduce((acc, v) => acc + Number(v.cantidad), 0);

    if (totalVentasCard) totalVentasCard.innerHTML = `${totalVentasCantidad}`;

});