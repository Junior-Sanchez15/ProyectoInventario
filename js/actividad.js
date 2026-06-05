function guardarActividad(texto){

    let actividad = obtenerDatos("actividad");
    actividad.unshift(texto);

    if(actividad.length > 5){
        actividad.pop();
    }

    localStorage.setItem("actividad", JSON.stringify(actividad));

}