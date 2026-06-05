// Utilidades de Local Storage (storage.js)
function obtenerDatos(key, tipo = "array") {
    try {
        let data = localStorage.getItem(key);
        if (!data) return tipo === "array" ? [] : null;
        return JSON.parse(data);
    } catch {
        return tipo === "array" ? [] : null;
    }
}

function guardarDatos(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Generar ID único
function generarId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Migración: Asignar ID a elementos antiguos que no lo tengan
(function migrarDatos() {
    let productos = obtenerDatos("productos");
    let modificado = false;
    productos.forEach(p => {
        if (!p.id) {
            p.id = generarId();
            modificado = true;
        }
    });
    if (modificado) guardarDatos("productos", productos);

    let categorias = obtenerDatos("categorias");
    modificado = false;
    categorias.forEach(c => {
        if (!c.id) {
            c.id = generarId();
            modificado = true;
        }
    });
    if (modificado) guardarDatos("categorias", categorias);
})();
