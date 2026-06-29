const express = require("express");
const router = express.Router();
const db = require("../db");


//  GET → Obtener todas las categorías
router.get("/", (req, res) => {
    db.query("SELECT * FROM categorias", (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al obtener categorías");
        }
        res.json(result);
    });
});


// POST → Crear categoría
router.post("/", (req, res) => {
    const { id, nombre, descripcion } = req.body;

    db.query(
        "INSERT INTO categorias (id, nombre, descripcion) VALUES (?, ?, ?)",
        [id, nombre, descripcion],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error al guardar categoría");
            }
            res.send("Categoría guardada");
        }
    );
});


//  PUT → Actualizar categoría
router.put("/:id", (req, res) => {
    const { nombre, descripcion } = req.body;
    const id = req.params.id;

    // Primero obtenemos la categoría actual
    db.query("SELECT * FROM categorias WHERE id=?", [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length === 0) return res.status(404).send("Categoría no encontrada");

        const nombreAnterior = result[0].nombre;

        // Actualizar la categoría
        db.query(
            "UPDATE categorias SET nombre=?, descripcion=? WHERE id=?",
            [nombre, descripcion, id],
            (err) => {
                if (err) return res.status(500).send(err);

                // CASCADA EN BACKEND
                db.query(
                    "UPDATE productos SET categoria=? WHERE categoria=?",
                    [nombre, nombreAnterior],
                    (err) => {
                        if (err) return res.status(500).send(err);

                        res.send("Categoría y productos actualizados");
                    }
                );
            }
        );
    });
});


//  DELETE → Eliminar categoría
router.delete("/:id", (req, res) => {
    db.query(
        "DELETE FROM categorias WHERE id=?",
        [req.params.id],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error al eliminar categoría");
            }
            res.send("Categoría eliminada");
        }
    );
});

module.exports = router;