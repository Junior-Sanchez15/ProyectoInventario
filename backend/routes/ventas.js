const express = require("express");
const router = express.Router();
const db = require("../db");


// GET → Obtener todas las ventas
router.get("/", (req, res) => {
    db.query("SELECT * FROM ventas", (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al obtener ventas");
        }
        res.json(result);
    });
});


// POST → Registrar venta
router.post("/", (req, res) => {
    const { producto, cantidad, precio, total } = req.body;

    db.query(
        "INSERT INTO ventas (producto, cantidad, precio, total, fecha) VALUES (?, ?, ?, ?, NOW())",
        [producto, cantidad, precio, total],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error al registrar venta");
            }
            res.send("Venta registrada");
        }
    );
});

module.exports = router;