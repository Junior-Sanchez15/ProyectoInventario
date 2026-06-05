// Escudo contra errores de Local Storage
function obtenerDatos(key, tipo = "array"){
    try{
        let data = localStorage.getItem(key);

        if(!data) return tipo === "array" ? [] : null;

        return JSON.parse(data);

    }catch{
        return tipo === "array" ? [] : null;
    }
}