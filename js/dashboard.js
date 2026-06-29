// Lógica del Dashboard (dashboard.js)

document.addEventListener("DOMContentLoaded", async () => {

    // 🔥 CAMBIO: ahora usamos backend en vez de localStorage
    let productos = [];
    let categorias = [];

    async function cargarDatos() {
        const resProductos = await fetch("http://localhost:3000/api/productos");
        productos = await resProductos.json();

        const resCategorias = await fetch("http://localhost:3000/api/categorias");
        categorias = await resCategorias.json();
    }

    await cargarDatos();

    // --- Dashboard Cards ---
    const totalProductos = document.getElementById("totalProductos");
    const totalCategorias = document.getElementById("totalCategorias");
    const totalStock = document.getElementById("totalStock");

    if (totalProductos) totalProductos.innerHTML = `${productos.length}`;
    if (totalCategorias) totalCategorias.innerHTML = `${categorias.length}`;

    if (totalStock) {
        let sumaStock = productos.reduce((acc, p) => acc + Number(p.cantidad), 0);
        totalStock.innerHTML = `${sumaStock}`;
    }

    // --- Tabla Productos y Búsqueda ---
    const tabla = document.getElementById("tablaProductos");
    const searchInput = document.getElementById("buscarProducto");

    function renderTable(filtro = "") {
        if (!tabla) return;
        
        const filteredProductos = productos.filter(p => 
            p.nombre.toLowerCase().includes(filtro.toLowerCase()) || 
            p.categoria.toLowerCase().includes(filtro.toLowerCase())
        );

        let htmlContent = "";
        
        if (filteredProductos.length === 0) {
            htmlContent = `<tr><td colspan="6" style="text-align:center; color: var(--text-muted);">No se encontraron productos.</td></tr>`;
        } else {
            filteredProductos.forEach((producto, index) => {
                const originalIndex = productos.findIndex(p => p.id === producto.id);

                htmlContent += `
                    <tr>
                        <td>${originalIndex + 1}</td>
                        <td><strong>${escapeHTML(producto.nombre)}</strong></td>
                        <td><span style="background: rgba(16, 185, 129, 0.1); color: var(--secondary-color); padding: 4px 8px; border-radius: 4px; font-size: 0.85rem;">${escapeHTML(producto.categoria)}</span></td>
                        <td>${formatearMoneda(producto.precio)}</td>
                        <td>${producto.cantidad}</td>
                        <td>
                            <button class="btn-editar" onclick="editarProducto('${producto.id}')"><i class="fa-solid fa-pen"></i> Editar</button>
                            <button class="btn-eliminar" onclick="eliminarProducto('${producto.id}')"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            });
        }
        tabla.innerHTML = htmlContent;
    }

    // Inicializar tabla
    if (tabla) renderTable();

    // Evento de búsqueda dinámica
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            renderTable(e.target.value);
        });
    }

});

// --- Acciones Globales (Delete / Edit) ---
window.eliminarProducto = function(id) {

    // 🔥 CAMBIO: ahora usa backend
    showConfirmDialog(`¿Estás seguro de que deseas eliminar el producto?`, async () => {

        await fetch(`http://localhost:3000/api/productos/${id}`, {
            method: "DELETE"
        });

        if (typeof guardarActividad === "function") {
            guardarActividad("❌ Producto eliminado");
        }

        showToast("Producto eliminado correctamente", "exito");
        
        setTimeout(() => location.reload(), 1500);
    });
};

window.editarProducto = function(id) {

    // 🔥 CAMBIO: buscar desde backend ya cargado
    fetch("http://localhost:3000/api/productos")
        .then(res => res.json())
        .then(productos => {
            let producto = productos.find(p => p.id === id);

            if (!producto) return;

            guardarDatos("productoEditar", producto);
            window.location.href = "productos.html";
        });
};