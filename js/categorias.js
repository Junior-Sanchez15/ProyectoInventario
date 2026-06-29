// Lógica de Categorías (categorias.js)

let categorias = [];

// Cargar desde backend
async function cargarCategorias() {
    const res = await fetch("http://localhost:3000/api/categorias");
    categorias = await res.json();
}

document.addEventListener("DOMContentLoaded", async () => {

    await cargarCategorias();

    // Cargar Datos para editar si existe
    let categoriaEditar = obtenerDatos("categoriaEditar", "objeto");

    if (categoriaEditar) {
        document.getElementById("nombreCategoria").value = categoriaEditar.nombre;
        document.getElementById("descripcionCategoria").value = categoriaEditar.descripcion;
    }

    // Formulario
    const formulario = document.getElementById("formCategoria");

    if (formulario) {
        formulario.addEventListener("submit", async function(e) {
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
            let categoriaEditarObj = obtenerDatos("categoriaEditar", "objeto");

            // EDITAR (PUT)
            if (categoriaEditarObj) {

                await fetch(`http://localhost:3000/api/categorias/${categoriaEditarObj.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(categoria)
                });
                
                localStorage.removeItem("categoriaEditar");

                if (typeof guardarActividad === "function") {
                    guardarActividad("✏️ Categoría editada: " + nombre);
                }
            } else {
                // CREAR (POST)
                categoria.id = generarId();

                await fetch("http://localhost:3000/api/categorias", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(categoria)
                });

                if (typeof guardarActividad === "function") {
                    guardarActividad("✔ Categoría agregada: " + nombre);
                }
            }

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

    let categoria = categorias.find(c => c.id === id);
    if (!categoria) return;

    showConfirmDialog(`¿Eliminar <strong>${escapeHTML(categoria.nombre)}</strong>?`, async () => {

        await fetch(`http://localhost:3000/api/categorias/${id}`, {
            method: "DELETE"
        });

        if (typeof guardarActividad === "function") {
            guardarActividad("❌ Categoría eliminada: " + categoria.nombre);
        }

        showToast("Categoría eliminada", "exito");
        setTimeout(() => location.reload(), 1000);
    });
};

// Editar Categoría
window.editarCategoria = function(id) {
    let categoria = categorias.find(c => c.id === id);
    if (!categoria) return;

    guardarDatos("categoriaEditar", categoria);
    location.reload();
};