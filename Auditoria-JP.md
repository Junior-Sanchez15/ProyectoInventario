# Auditoría técnica - ProyectoInventario

Fecha: 2026-06-25
Autor: Copilot

## Resumen ejecutivo

Se revisaron los cambios del PR relacionado con la integración del backend, la persistencia en MySQL y la adaptación del frontend. El trabajo es prometedor y ya deja la base para un sistema más robusto, pero aún hay varios riesgos de consistencia, seguridad y mantenibilidad que conviene corregir antes de consolidar la implementación.

## Main findings

### 1) Las ventas no están garantizadas en el backend
**Nivel:** Alto

El flujo de ventas depende del frontend para actualizar el stock. Si un cliente o un script externo llama directamente a la API, puede registrar ventas sin respetar el inventario real.

### 2) La API confía demasiado en los datos enviados por el cliente
**Nivel:** Alto

Los endpoints de productos y categorías aceptan datos sin validar profundamente campos obligatorios, nombres vacíos, cantidades negativas, precios inválidos o categorías inexistentes.

### 3) El cambio de categoría no es transaccional
**Nivel:** Medio

Cuando se actualiza una categoría, el backend modifica también los productos asociados. Si una de las dos operaciones falla, el sistema puede quedar en un estado inconsistente.

### 4) La configuración está hardcodeada
**Nivel:** Medio

La conexión a MySQL y la URL del backend están fijadas directamente en el código, lo cual dificulta ejecutar el proyecto en otros entornos.

### 5) El manejo de errores en el frontend es débil
**Nivel:** Medio

Muchas solicitudes fetch asumen éxito aunque el servidor responda con error. Eso genera mensajes poco claros y deja al usuario con una experiencia inconsistente.

---

## Recomendaciones

### Recomendación 1: Asegurar ventas atómicas y consistentes en el backend
**Objetivo:** evitar que una venta se registre si no hay stock suficiente o si falla la actualización del inventario.

**Cómo aplicarlo:**
1. Abrir el archivo backend/routes/ventas.js.
2. Implementar la lógica de venta dentro de una transacción.
3. Validar que el producto exista.
4. Verificar que la cantidad solicitada sea menor o igual al stock actual.
5. Restar el stock y registrar la venta en una sola operación transaccional.
6. Si ocurre algún error, hacer rollback y devolver un estado 400 o 409 al cliente.

**Ejemplo de flujo recomendado:**
- Verificar producto.
- Comprobar stock.
- Reducir stock.
- Insertar venta.
- Confirmar transacción.
- Si algo falla, deshacer todo.

### Recomendación 2: Validar datos en servidor antes de guardar
**Objetivo:** evitar registros inválidos o incompletos.

**Cómo aplicarlo:**
1. En backend/routes/productos.js, validar:
   - nombre no vacío
   - categoría no vacía
   - precio mayor que 0
   - cantidad mayor o igual a 0
   - descripción no vacía
2. En backend/routes/categorias.js, validar:
   - nombre con longitud mínima
   - descripción con longitud mínima
3. Si falla la validación, devolver respuesta HTTP 400 con un mensaje claro.
4. Añadir restricciones en la base de datos con SQL para reforzar la regla, por ejemplo:
   - precio DECIMAL NOT NULL CHECK (precio > 0)
   - cantidad INT NOT NULL CHECK (cantidad >= 0)
   - nombre VARCHAR(100) NOT NULL

### Recomendación 3: Hacer transaccional el cambio de categoría
**Objetivo:** mantener consistencia entre categorías y productos al renombrar una categoría.

**Cómo aplicarlo:**
1. En backend/routes/categorias.js, envolver la actualización en una transacción.
2. Actualizar la categoría.
3. Actualizar los productos asociados.
4. Confirmar la transacción solo si ambas operaciones fueron exitosas.
5. Si falla una, hacer rollback.

### Recomendación 4: Mover configuraciones sensibles a variables de entorno
**Objetivo:** preparar el proyecto para desarrollo, pruebas y producción.

**Cómo aplicarlo:**
1. Instalar dotenv en backend.
2. Crear un archivo .env en backend con valores como:
   - DB_HOST=localhost
   - DB_USER=root
   - DB_PASSWORD=
   - DB_NAME=inventario_db
   - PORT=3000
3. Actualizar backend/db.js y backend/server.js para leer esas variables.
4. Evitar subir el archivo .env al repositorio (ya está cubierto por .gitignore).

### Recomendación 5: Mejorar el manejo de errores en el frontend
**Objetivo:** que la interfaz responda de forma clara cuando el backend falla.

**Cómo aplicarlo:**
1. En los archivos js/categorias.js, js/productos.js, js/ventas.js y js/dashboard.js, revisar cada fetch.
2. Verificar res.ok antes de leer el cuerpo de la respuesta.
3. Mostrar mensajes de error usando showToast.
4. Capturar excepciones con try/catch y mostrar un mensaje amigable al usuario.

---

## Cómo implementar cada recomendación paso a paso

### Paso a paso: ventas atómicas

1. Abrir backend/routes/ventas.js.
2. Cambiar la lógica actual para que haga lo siguiente:
   - obtener el producto por ID
   - comprobar stock
   - disminuir stock
   - guardar venta
3. Usar una transacción de MySQL.
4. Si la cantidad solicitada supera el stock, responder con un error 409.
5. Si hay un problema en la base de datos, responder con 500 y hacer rollback.

### Paso a paso: validación de datos

1. En backend/routes/productos.js, agregar una función de validación reutilizable.
2. Llamarla antes de insertar o actualizar.
3. En backend/routes/categorias.js, hacer lo mismo para el nombre y la descripción.
4. Retornar mensajes claros como:
   - "El nombre es obligatorio"
   - "El precio debe ser mayor que 0"
   - "La cantidad no puede ser negativa"

### Paso a paso: transacción al actualizar categorías

1. En backend/routes/categorias.js, iniciar transacción.
2. Ejecutar UPDATE en categorias.
3. Ejecutar UPDATE en productos.
4. Confirmar con commit.
5. En caso de error, ejecutar rollback.

### Paso a paso: variables de entorno

1. Crear backend/.env.
2. Añadir:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=inventario_db
   PORT=3000
   ```
3. Instalar dotenv:
   ```bash
   npm install dotenv
   ```
4. Ajustar backend/db.js para usar process.env.

### Paso a paso: manejo de errores en el frontend

1. En cada función de fetch, usar:
   ```js
   const res = await fetch(url, options);
   if (!res.ok) {
       throw new Error("Error del servidor");
   }
   ```
2. Capturar con try/catch.
3. Mostrar mensaje con showToast("Error al guardar", "error").

---

## Conclusión

La integración backend/frontend ya mejora la experiencia del proyecto, pero aún necesita reforzarse en tres puntos clave: consistencia de inventario, validación de datos y robustez operativa. Aplicando estas recomendaciones, el sistema quedará mucho más preparado para uso real.
