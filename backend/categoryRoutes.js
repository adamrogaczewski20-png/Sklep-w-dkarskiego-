const express = require("express");
const pool = require("./db");
const buildCategoryTree = require("./categoryTree");

const router = express.Router();

// Całe drzewo kategorii
router.get("/api/categories/tree", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        parent_id,
        name,
        slug,
        description,
        sort_order
      FROM categories
      WHERE is_active = TRUE
      ORDER BY sort_order, name
    `);

    const tree = buildCategoryTree(result.rows);

    res.json(tree);
  } catch (error) {
    console.error("Błąd pobierania drzewa kategorii:", error);

    res.status(500).json({
      error: "Nie udało się pobrać kategorii"
    });
  }
});

// Pobieranie wszystkich kategorii
router.get("/api/categories", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        parent_id,
        name,
        slug,
        description,
        sort_order
      FROM categories
      WHERE is_active = TRUE
      ORDER BY parent_id NULLS FIRST, sort_order, name
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Błąd pobierania kategorii:", error);

    res.status(500).json({
      error: "Nie udało się pobrać kategorii"
    });
  }
});

// Pobieranie podkategorii
router.get("/api/categories/:id/children", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        parent_id,
        name,
        slug,
        description,
        sort_order
      FROM categories
      WHERE parent_id = $1
        AND is_active = TRUE
      ORDER BY sort_order, name
    `, [req.params.id]);

    res.json(result.rows);
  } catch (error) {
    console.error("Błąd pobierania podkategorii:", error);

    res.status(500).json({
      error: "Nie udało się pobrać podkategorii"
    });
  }
});

module.exports = router;
