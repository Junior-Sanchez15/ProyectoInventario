// Lógica de Ventas (ventas.js)
document.addEventListener("DOMContentLoaded", async () => {

    const precioInput = document.getElementById("precioProducto");
    const totalInput = document.getElementById("totalVenta");
    const cantidadInput = document.getElementById("cantidadVenta");
    const select = document.getElementById("productoVenta");
    const btnVender = document.getElementById("btnVender");

    // CAMBIO: cargar productos desde backend
    let productos = [];

    async function cargarProductos() {
        const res = await fetch("http://localhost:3000/api/productos");
        productos = await res.json();
    }

    await cargarProductos();

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

        precioInput.value = formatearMoneda(producto.precio);
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
        totalInput.value = formatearMoneda(total);
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

            let producto = productos.find(p => p.id === id);

            if (!producto) return;

            if (producto.cantidad < cantidad) {
                showToast(`Stock insuficiente. Solo quedan ${producto.cantidad} unidades.`, "error");
                return;
            }

            let total = producto.precio * cantidad;

            // Confirmar venta
            showConfirmDialog(
                `Confirmar venta de <strong>${cantidad}x ${producto.nombre}</strong> por <strong>$${total.toFixed(2)}</strong>`,
                
                async () => {

                    try {
                        // RESTAR STOCK EN BACKEND
                        producto.cantidad -= cantidad;

                        const res = await fetch(`http://localhost:3000/api/productos/${producto.id}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(producto)
                        });

                        if (!res.ok) {
                            throw new Error("Error en servidor");
                        }
                        //GUARDAR VENTA EN BACKEND
                        const resVenta = await fetch("http://localhost:3000/api/ventas", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                producto: producto.nombre,
                                cantidad: cantidad,
                                precio: producto.precio,
                                total: total
                            })
                        });
                        
                        if (!resVenta.ok) {
                            throw new Error("Error al guardar la venta");
                        }

                        if (typeof guardarActividad === "function") {
                            guardarActividad(`✔ Venta: ${producto.nombre} x${cantidad} ($${total.toFixed(2)})`);
                        }

                        showToast("Venta realizada con éxito", "exito");

                        setTimeout(() => location.reload(), 1500);

                    } catch (error) {
                        console.error(error);
                        showToast("Error al procesar la venta", "error");
                    }
                }
            );
        });
    }

    // Inicializar
    if (cantidadInput) cantidadInput.value = 1;
    actualizarPrecio();
    calcularTotal();
});