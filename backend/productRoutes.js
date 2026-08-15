const express = require("express");
const pool = require("./db");

const router = express.Router();

// Pobieranie wszystkich aktywnych produktów
router.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.name,
        p.slug,
        p.description,
        p.sku,
        p.price,
        p.category_id,
        c.name AS category_name,
        c.slug AS category_slug
      FROM products p
      JOIN categories c ON c.id = p.category_id
      WHERE p.is_active = TRUE
      ORDER BY p.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Błąd pobierania produktów:", error);

    res.status(500).json({
      error: "Nie udało się pobrać produktów"
    });
  }
});

// Pobieranie jednego produktu
router.get("/api/products/:id", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.name,
        p.slug,
        p.description,
        p.sku,
        p.price,
        p.category_id,
        c.name AS category_name,
        c.slug AS category_slug
      FROM products p
      JOIN categories c ON c.id = p.category_id
      WHERE p.id = $1
        AND p.is_active = TRUE
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Produkt nie istnieje"
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Błąd pobierania produktu:", error);

    res.status(500).json({
      error: "Nie udało się pobrać produktu"
    });
  }
});

module.exports = router;
