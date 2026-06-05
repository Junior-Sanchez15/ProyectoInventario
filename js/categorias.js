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

            const categoria = { nombre, descripcion };
            let categorias = obtenerDatos("categorias");

            if (obtenerDatos("categoriaEditar", "objeto")) {
                let index = categorias.findIndex(c => c.nombre === categoriaEditar.nombre);

                if (index !== -1) {
                    categorias[index] = categoria;
                }

                localStorage.removeItem("categoriaEditar");

                if (typeof guardarActividad === "function") {
                    guardarActividad("✏️ Categoría editada: " + nombre);
                }
            } else {
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
        tablaCategorias.innerHTML = "";

        if (categorias.length === 0) {
            tablaCategorias.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--text-muted);">No hay categorías registradas.</td></tr>`;
        } else {
            categorias.forEach((cat, index) => {
                const fila = `
                    <tr>
                        <td>${index + 1}</td>
                        <td><strong>${cat.nombre}</strong></td>
                        <td>${cat.descripcion}</td>
                        <td>
                            <button class="btn-editar" onclick="editarCategoria(${index})"><i class="fa-solid fa-pen"></i> Editar</button>
                            <button class="btn-eliminar" onclick="eliminarCategoria(${index})"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    </tr>
                `;
                tablaCategorias.innerHTML += fila;
            });
        }
    }
});

// Eliminar Categoría
window.eliminarCategoria = function(index) {
    let categorias = obtenerDatos("categorias");

    showConfirmDialog(`¿Estás seguro de eliminar la categoría <strong>${categorias[index].nombre}</strong>?`, () => {
        const nombreEliminado = categorias[index].nombre;
        categorias.splice(index, 1);
        
        guardarDatos("categorias", categorias);

        if (typeof guardarActividad === "function") {
            guardarActividad("❌ Categoría eliminada: " + nombreEliminado);
        }

        showToast("Categoría eliminada", "exito");
        setTimeout(() => location.reload(), 1500);
    });
};

// Editar Categoría
window.editarCategoria = function(index) {
    let categorias = obtenerDatos("categorias");
    let categoria = categorias[index];

    guardarDatos("categoriaEditar", categoria);
    
    // Smooth scroll to top instead of reload if we want, but reload is simpler for form population
    location.reload();
};