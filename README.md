# ProyectoInventario

Proyecto Integrador ISW-306 - Sistema Web de Inventario

# Instrucciones de instalación

Requisitos

Node.js
XAMPP (MySQL)
Visual Studio Code (opcional)
Live Server (opcional)

1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>

2. Instalar las dependencias

Abrir una terminal dentro de la carpeta backend y ejecutar:

npm install

3. Iniciar MySQL

Abrir XAMPP Control Panel y encender (Start) el servicio MySQL y Apache.

4. Crear la base de datos

Abrir phpMyAdmin y crear una base de datos llamada:

inventario_db

5. Importar la base de datos

Seleccionar la base de datos inventario_db. (Cual esta en el repositorio)

Ir a la pestaña Importar.

Seleccionar el archivo inventario_db.sql incluido en este proyecto.

Presionar Continuar.

6. Configurar la conexión

Verificar el archivo:

backend/db.js

Configuración utilizada:

host: "localhost"
user: "root"
password: ""
database: "inventario_db"

7. Ejecutar el servidor

Abrir una terminal dentro de la carpeta backend y ejecutar:

node server.js

Si todo está correcto aparecerá:

Servidor en http://localhost:3000
Conectado a MySQL

8. Ejecutar el proyecto

Abrir el archivo index.html utilizando Live Server.

Funcionalidades
Registro de categorías.
Registro de productos.
Registro de ventas.
Control de inventario.
Actualización automática del stock.
Persistencia de datos con MySQL.
Integración del frontend con el backend mediante API REST.