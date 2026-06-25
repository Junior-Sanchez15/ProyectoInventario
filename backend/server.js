const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Conexión DB
const db = require("./db");

// Rutas
app.use("/api/productos", require("./routes/productos"));
app.use("/api/categorias", require("./routes/categorias"));
app.use("/api/ventas", require("./routes/ventas"));

// Ruta de prueba
app.get("/", (req, res) => {
    res.send("Servidor funcionando 🔥");
});

//  Levantar servidor
app.listen(3000, () => {
    console.log("🚀 Servidor en http://localhost:3000");
});