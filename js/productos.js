// 🔹 Variables globales
let categorias = [];

// Lógica de Productos (productos.js)
document.addEventListener("DOMContentLoaded", async () => {

    // 🔹 Cargar categorías desde backend
    async function cargarCategorias() {
        const res = await fetch("http://localhost:3000/api/categorias");
        categorias = await res.json();
    }

    await cargarCategorias();

    // 🔹 Llenar Select de Categorias
    const selectCategoria = document.getElementById("categoriaProducto");

    if (selectCategoria) {
        selectCategoria.innerHTML = '<option value="">Seleccione una categoría</option>';

        if (categorias.length === 0) {
            const opcion = document.createElement("option");
            opcion.value = "";
            opcion.textContent = "No hay categorías disponibles";
            opcion.disabled = true;
            selectCategoria.appendChild(opcion);
        } else {
            categorias.forEach(cat => {
                const opcion = document.createElement("option");
                opcion.value = cat.nombre;
                opcion.textContent = cat.nombre;
                selectCategoria.appendChild(opcion);
            });
        }
    }

    // 🔹 Cargar Producto para editar
    let productoEditar = obtenerDatos("productoEditar", "objeto");

    if (productoEditar) {
        document.getElementById("nombreProducto").value = productoEditar.nombre;
        if (selectCategoria) selectCategoria.value = productoEditar.categoria;
        document.getElementById("precioProducto").value = productoEditar.precio;
        document.getElementById("cantidadProducto").value = productoEditar.cantidad;
        document.getElementById("descripcionProducto").value = productoEditar.descripcion;
    }

    // 🔹 Formulario
    const formulario = document.getElementById("formProducto");

    if (formulario) {
        formulario.addEventListener("submit", async function(event) {
            event.preventDefault();

            const nombre = document.getElementById("nombreProducto").value.trim();
            const categoria = document.getElementById("categoriaProducto").value;
            const precio = parseFloat(document.getElementById("precioProducto").value);
            const cantidad = parseInt(document.getElementById("cantidadProducto").value);
            const descripcion = document.getElementById("descripcionProducto").value.trim();

            // 🔹 Validaciones
            if (nombre === "" || categoria === "" || isNaN(precio) || isNaN(cantidad) || descripcion === "") {
                showToast("Todos los campos son obligatorios", "error");
                return;
            }

            if (nombre.length < 2) {
                showToast("El nombre debe tener al menos 2 caracteres", "error");
                return;
            }

            if (descripcion.length < 7) {
                showToast("La descripción debe tener al menos 7 caracteres", "error");
                return;
            }

            if (precio <= 0) {
                showToast("El precio debe ser mayor que 0", "error");
                return;
            }

            if (cantidad < 0) {
                showToast("La cantidad no puede ser negativa", "error");
                return;
            }

            let producto = { nombre, categoria, precio, cantidad, descripcion };
            let productoEditarObj = obtenerDatos("productoEditar", "objeto");

            try {

                if (productoEditarObj) {
                    // 🔹 EDITAR
                    producto.id = productoEditarObj.id;

                    const res = await fetch(`http://localhost:3000/api/productos/${producto.id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(producto)
                    });

                    if (!res.ok) {
                        throw new Error("Error al actualizar producto");
                    }

                    localStorage.removeItem("productoEditar");

                    if (typeof guardarActividad === "function") {
                        guardarActividad("✏️ Producto editado: " + nombre);
                    }

                } else {
                    // 🔹 CREAR
                    producto.id = generarId();

                    const res = await fetch("http://localhost:3000/api/productos", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(producto)
                    });

                    if (!res.ok) {
                        throw new Error("Error al guardar producto");
                    }

                    if (typeof guardarActividad === "function") {
                        guardarActividad("✔ Producto agregado: " + nombre);
                    }
                }

                // 🔹 Éxito
                showToast("Producto guardado correctamente", "exito");
                formulario.reset();

                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1500);

            } catch (error) {
                console.error(error);
                showToast("Error al guardar producto", "error");
            }
        });
    }
});