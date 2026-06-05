// Lógica de Productos (productos.js)

document.addEventListener("DOMContentLoaded", () => {
    // Llenar Select de Categorias
    const selectCategoria = document.getElementById("categoriaProducto");
    let categorias = obtenerDatos("categorias");

    if (selectCategoria) {
        if (categorias.length === 0) {
            const opcion = document.createElement("option");
            opcion.value = "";
            opcion.textContent = "No hay categorías disponibles";
            opcion.disabled = true;
            selectCategoria.appendChild(opcion);
        } else {
            categorias.forEach(function(cat) {
                const opcion = document.createElement("option");
                opcion.value = cat.nombre;
                opcion.textContent = cat.nombre;
                selectCategoria.appendChild(opcion);
            });
        }
    }

    // Cargar Producto para editar
    let productoEditar = obtenerDatos("productoEditar", "objeto");

    if (productoEditar) {
        document.getElementById("nombreProducto").value = productoEditar.nombre;
        if (selectCategoria) selectCategoria.value = productoEditar.categoria;
        document.getElementById("precioProducto").value = productoEditar.precio;
        document.getElementById("cantidadProducto").value = productoEditar.cantidad;
        document.getElementById("descripcionProducto").value = productoEditar.descripcion;
    }

    // Formulario
    const formulario = document.getElementById("formProducto");

    if (formulario) {
        formulario.addEventListener("submit", function(event) {
            event.preventDefault();

            const nombre = document.getElementById("nombreProducto").value.trim();
            const categoria = document.getElementById("categoriaProducto").value;
            const precio = parseFloat(document.getElementById("precioProducto").value);
            const cantidad = parseInt(document.getElementById("cantidadProducto").value);
            const descripcion = document.getElementById("descripcionProducto").value.trim();

            // Validaciones con Toast
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

            // Producto
            const producto = { nombre, categoria, precio, cantidad, descripcion };

            // Local Storage
            let productos = obtenerDatos("productos");

            if (obtenerDatos("productoEditar", "objeto")) {
                let index = productos.findIndex(p => p.nombre === productoEditar.nombre);
                
                if (index !== -1) {
                    productos[index] = producto;
                }

                localStorage.removeItem("productoEditar");

                if (typeof guardarActividad === "function") {
                    guardarActividad("✏️ Producto editado: " + nombre);
                }
            } else {
                productos.push(producto);

                if (typeof guardarActividad === "function") {
                    guardarActividad("✔ Producto agregado: " + nombre);
                }
            }

            guardarDatos("productos", productos);

            showToast("Producto guardado correctamente", "exito");
            formulario.reset();

            // Redirigir al dashboard o recargar
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
        });
    }
});