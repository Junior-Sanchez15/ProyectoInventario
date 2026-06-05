// Gestión de Actividad (actividad.js)

function guardarActividad(texto) {
    let actividad = obtenerDatos("actividad");
    actividad.unshift(texto);

    // Mantener solo los últimos 6 registros
    if (actividad.length > 6) {
        actividad.pop();
    }

    guardarDatos("actividad", actividad);

    // Actualizar visualmente si la lista está presente en la página actual
    if (document.getElementById("listaActividad")) {
        renderizarActividad();
    }
}

// Inicializar la renderización cuando cargue el DOM
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("listaActividad")) {
        renderizarActividad();
    }
});