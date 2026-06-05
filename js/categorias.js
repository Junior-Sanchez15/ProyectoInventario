// Lógica de Categorías (categorias.js)

document.addEventListener("DOMContentLoaded", () => {
    // Cargar Datos para editar si existe
    let categoriaEditar = obtenerDatos("categoriaEditar", "objeto");

    if (categoriaEditar) {
        document.getElementById("nombreCategoria").value = categoriaEditar.nombre;
        document.getElementById("descripcionCategoria").value = categoriaEditar.descripcion;
    }

    // Formulario
    const formulario = document.getElementById("formCategoria");

    if (formulario) {
        formulario.addEventListener("submit", function(e) {
            e.preventDefault();

            const nombre = document.getElementById("nombreCategoria").value.trim();
            const descripcion = document.getElementById("descripcionCategoria").value.trim();

            // Validaciones con Toast
            if (nombre === "" || descripcion === "") {
                showToast("Todos los campos son obligatorios", "error");
                return;
            }

            if (nombre.length < 3) {
                showToast("El nombre debe tener al menos 3 caracteres", "error");
                return;
            }

            if (descripcion.length < 5) {
                showToast("La descripción es muy corta", "error");
                return;
            }

            let categoria = { nombre, descripcion };
            let categorias = obtenerDatos("categorias");
            let categoriaEditarObj = obtenerDatos("categoriaEditar", "objeto");

            if (categoriaEditarObj) {
                categoria.id = categoriaEditarObj.id;
                let index = categorias.findIndex(c => c.id === categoriaEditarObj.id);

                if (index !== -1) {
                    categorias[index] = categoria;
                }

                // Actualización en cascada de productos
                let productos = obtenerDatos("productos");
                let productosModificados = false;
                productos.forEach(p => {
                    if (p.categoria === categoriaEditarObj.nombre) {
                        p.categoria = categoria.nombre;
                        productosModificados = true;
                    }
                });
                if (productosModificados) guardarDatos("productos", productos);

                localStorage.removeItem("categoriaEditar");

                if (typeof guardarActividad === "function") {
                    guardarActividad("✏️ Categoría editada: " + nombre);
                }
            } else {
                categoria.id = generarId();
                categorias.push(categoria);

                if (typeof guardarActividad === "function") {
                    guardarActividad("✔ Categoría agregada: " + nombre);
                }
            }

            guardarDatos("categorias", categorias);

            showToast("Categoría guardada correctamente", "exito");
            formulario.reset();

            // Recargar para mostrar cambios
            setTimeout(() => {
                location.reload();
            }, 1000);
        });
    }

    // Mostrar Categorías
    const tablaCategorias = document.getElementById("tablaCategorias");
    let categorias = obtenerDatos("categorias");

    if (tablaCategorias) {
        let htmlContent = "";

        if (categorias.length === 0) {
            htmlContent = `<tr><td colspan="4" style="text-align:center; color: var(--text-muted);">No hay categorías registradas.</td></tr>`;
        } else {
            categorias.forEach((cat, index) => {
                htmlContent += `
                    <tr>
                        <td>${index + 1}</td>
                        <td><strong>${escapeHTML(cat.nombre)}</strong></td>
                        <td>${escapeHTML(cat.descripcion)}</td>
                        <td>
                            <button class="btn-editar" onclick="editarCategoria('${cat.id}')"><i class="fa-solid fa-pen"></i> Editar</button>
                            <button class="btn-eliminar" onclick="eliminarCategoria('${cat.id}')"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            });
        }
        tablaCategorias.innerHTML = htmlContent;
    }
});

// Eliminar Categoría
window.eliminarCategoria = function(id) {
    let categorias = obtenerDatos("categorias");
    let index = categorias.findIndex(c => c.id === id);
    if (index === -1) return;

    let productos = obtenerDatos("productos");
    let categoriaNombre = categorias[index].nombre;
    
    let productosVinculados = productos.filter(p => p.categoria === categoriaNombre);
    if (productosVinculados.length > 0) {
        showToast(`No se puede eliminar. Hay ${productosVinculados.length} producto(s) en esta categoría.`, "error");
        return;
    }

    showConfirmDialog(`¿Estás seguro de eliminar la categoría <strong>${escapeHTML(categoriaNombre)}</strong>?`, () => {
        categorias.splice(index, 1);
        
        guardarDatos("categorias", categorias);

        if (typeof guardarActividad === "function") {
            guardarActividad("❌ Categoría eliminada: " + categoriaNombre);
        }

        showToast("Categoría eliminada", "exito");
        setTimeout(() => location.reload(), 1500);
    });
};

// Editar Categoría
window.editarCategoria = function(id) {
    let categorias = obtenerDatos("categorias");
    let index = categorias.findIndex(c => c.id === id);
    if (index === -1) return;
    
    let categoria = categorias[index];

    guardarDatos("categoriaEditar", categoria);
    
    // Smooth scroll to top instead of reload if we want, but reload is simpler for form population
    location.reload();
};