// Utilidades de Interfaz de Usuario (ui.js)

// --- Toasts (Notificaciones flotantes) ---
function showToast(mensaje, tipo = "exito") {
    // Buscar o crear el contenedor de toasts
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    // Crear el toast
    const toast = document.createElement("div");
    toast.className = `toast ${tipo}`;
    
    // Icono según el tipo
    const icono = tipo === "exito" ? '<i class="fa-solid fa-check-circle" style="color: var(--secondary-color); font-size: 1.5rem;"></i>' 
                                   : '<i class="fa-solid fa-circle-exclamation" style="color: var(--danger-color); font-size: 1.5rem;"></i>';
    
    toast.innerHTML = `${icono} <span>${mensaje}</span>`;
    
    container.appendChild(toast);

    // Animación de salida y eliminación
    setTimeout(() => {
        toast.classList.add("hiding");
        toast.addEventListener("animationend", () => {
            toast.remove();
        });
    }, 3000);
}

// --- Modales (Confirmación) ---
function showConfirmDialog(mensaje, onConfirm) {
    // Buscar o crear el overlay del modal
    let overlay = document.getElementById("modal-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "modal-overlay";
        overlay.className = "modal-overlay";
        document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
        <div class="modal">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <h3>Confirmar Acción</h3>
            <p>${mensaje}</p>
            <div class="modal-actions">
                <button class="btn-cancelar" id="btn-cancel-modal">Cancelar</button>
                <button class="btn-confirmar" id="btn-confirm-modal">Confirmar</button>
            </div>
        </div>
    `;

    // Activar el modal
    setTimeout(() => overlay.classList.add("active"), 10);

    // Event Listeners
    document.getElementById("btn-cancel-modal").onclick = () => {
        overlay.classList.remove("active");
        setTimeout(() => overlay.remove(), 300);
    };

    document.getElementById("btn-confirm-modal").onclick = () => {
        onConfirm();
        overlay.classList.remove("active");
        setTimeout(() => overlay.remove(), 300);
    };
}

// --- Renderizar Actividad Reciente ---
function renderizarActividad() {
    const listaActividad = document.getElementById("listaActividad");
    if (!listaActividad) return;

    let actividad = obtenerDatos("actividad");
    let contenido = "";

    if (actividad.length === 0) {
        listaActividad.innerHTML = "<p style='color: var(--text-muted);'>No hay actividad reciente.</p>";
        return;
    }

    actividad.forEach(item => {
        let clase = "";
        let icon = "";
        
        if (item.includes("✔")) {
            clase = "ok";
            icon = '<i class="fa-solid fa-circle-check" style="color: var(--secondary-color)"></i>';
        } else if (item.includes("✏️")) {
            clase = "edit";
            icon = '<i class="fa-solid fa-pen-to-square" style="color: var(--primary-color)"></i>';
        } else if (item.includes("❌")) {
            clase = "delete";
            icon = '<i class="fa-solid fa-trash" style="color: var(--danger-color)"></i>';
        } else {
            icon = '<i class="fa-solid fa-bell"></i>';
        }

        // Remover el emoji del texto para usar solo el icono FA
        let textoLimpio = item.replace(/✔|✏️|❌/g, '').trim();

        contenido += `<li class="${clase}">${icon} <span>${textoLimpio}</span></li>`;
    });

    listaActividad.innerHTML = contenido;
}
