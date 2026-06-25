const express = require("express");
const router = express.Router();
const db = require("../db");


// 🟢 GET → Obtener todos los productos
router.get("/", (req, res) => {
    db.query("SELECT * FROM productos", (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al obtener productos");
        }
        res.json(result);
    });
});


// 🟢 POST → Crear producto (CON VALIDACIÓN DE CATEGORÍA)
router.post("/", (req, res) => {
    const { id, nombre, categoria, precio, cantidad, descripcion } = req.body;

    // 🔥 Validar que la categoría exista
    db.query("SELECT * FROM categorias WHERE nombre=?", [categoria], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al validar categoría");
        }

        if (result.length === 0) {
            return res.status(400).send("La categoría no existe");
        }

        // Insertar producto
        db.query(
            "INSERT INTO productos (id, nombre, categoria, precio, cantidad, descripcion) VALUES (?, ?, ?, ?, ?, ?)",
            [id, nombre, categoria, precio, cantidad, descripcion],
            (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Error al guardar producto");
                }
                res.send("Producto guardado");
            }
        );
    });
});


// 🟢 PUT → Actualizar producto (CON VALIDACIÓN)
router.put("/:id", (req, res) => {
    const { nombre, categoria, precio, cantidad, descripcion } = req.body;
    const id = req.params.id;

    // 🔥 Validar categoría
    db.query("SELECT * FROM categorias WHERE nombre=?", [categoria], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al validar categoría");
        }

        if (result.length === 0) {
            return res.status(400).send("La categoría no existe");
        }

        // Actualizar producto
        db.query(
            "UPDATE productos SET nombre=?, categoria=?, precio=?, cantidad=?, descripcion=? WHERE id=?",
            [nombre, categoria, precio, cantidad, descripcion, id],
            (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Error al actualizar");
                }
                res.send("Producto actualizado");
            }
        );
    });
});


// 🟢 DELETE → Eliminar producto
router.delete("/:id", (req, res) => {
    db.query(
        "DELETE FROM productos WHERE id=?",
        [req.params.id],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error al eliminar");
            }
            res.send("Producto eliminado");
        }
    );
});


module.exports = router;