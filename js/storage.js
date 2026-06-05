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
