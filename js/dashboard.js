// Lógica del Dashboard (dashboard.js)

document.addEventListener("DOMContentLoaded", () => {
    let productos = obtenerDatos("productos");
    let categorias = obtenerDatos("categorias");

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
        
        tabla.innerHTML = "";
        
        const filteredProductos = productos.filter(p => 
            p.nombre.toLowerCase().includes(filtro.toLowerCase()) || 
            p.categoria.toLowerCase().includes(filtro.toLowerCase())
        );

        if (filteredProductos.length === 0) {
            tabla.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--text-muted);">No se encontraron productos.</td></tr>`;
            return;
        }

        filteredProductos.forEach((producto, index) => {
            // Find actual index in original array for editing/deleting
            const originalIndex = productos.findIndex(p => p.nombre === producto.nombre);

            const fila = `
                <tr>
                    <td>${originalIndex + 1}</td>
                    <td><strong>${producto.nombre}</strong></td>
                    <td><span style="background: rgba(16, 185, 129, 0.1); color: var(--secondary-color); padding: 4px 8px; border-radius: 4px; font-size: 0.85rem;">${producto.categoria}</span></td>
                    <td>$${parseFloat(producto.precio).toFixed(2)}</td>
                    <td>${producto.cantidad}</td>
                    <td>
                        <button class="btn-editar" onclick="editarProducto(${originalIndex})"><i class="fa-solid fa-pen"></i> Editar</button>
                        <button class="btn-eliminar" onclick="eliminarProducto(${originalIndex})"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
            tabla.innerHTML += fila;
        });
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
window.eliminarProducto = function(index) {
    let productos = obtenerDatos("productos");
    
    showConfirmDialog(`¿Estás seguro de que deseas eliminar el producto <strong>${productos[index].nombre}</strong>?`, () => {
        const nombreEliminado = productos[index].nombre;
        productos.splice(index, 1);
        guardarDatos("productos", productos);

        if (typeof guardarActividad === "function") {
            guardarActividad("❌ Producto eliminado: " + nombreEliminado);
        }

        showToast("Producto eliminado correctamente", "exito");
        
        // Recargar la página después del toast
        setTimeout(() => location.reload(), 1500);
    });
};

window.editarProducto = function(index) {
    let productos = obtenerDatos("productos");
    let producto = productos[index];
    
    guardarDatos("productoEditar", producto);
    window.location.href = "productos.html";
};