const express = require("express");
const pool = require("./db");
const { requireAuth, requireAdmin } = require("./auth/authMiddleware");

const router = express.Router();

router.use(requireAuth);
router.use(requireAdmin);

// Lista produktów
router.get("/api/admin/products", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                p.id,
                p.name,
                p.slug,
                p.description,
                p.sku,
                p.price,
                p.is_active,
                p.created_at,
                p.updated_at,
                c.name AS category_name,
                i.quantity,
                i.reserved_quantity
            FROM products p
            JOIN categories c
                ON c.id = p.category_id
            LEFT JOIN inventory i
                ON i.product_id = p.id
            ORDER BY p.created_at DESC
        `);

        res.json(result.rows);

    } catch (error) {
        console.error("Błąd pobierania produktów:", error);

        res.status(500).json({
            error: "Nie udało się pobrać produktów."
        });
    }
});

// Dodawanie produktu
router.post("/api/admin/products", async (req, res) => {
    const client = await pool.connect();

    try {
        const {
            name,
            category_id,
            description,
            sku,
            price,
            quantity
        } = req.body;

        if (!name || !category_id || price === undefined) {
            return res.status(400).json({
                error: "Nazwa, kategoria i cena są wymagane."
            });
        }

        await client.query("BEGIN");

        const slug = name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9ąćęłńóśźż\s-]/gi, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

        const productResult = await client.query(
            `
            INSERT INTO products (
                category_id,
                name,
                slug,
                description,
                sku,
                price
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            `,
            [
                category_id,
                name,
                slug,
                description || null,
                sku || null,
                price
            ]
        );

        const product = productResult.rows[0];

        await client.query(
            `
            INSERT INTO inventory (
                product_id,
                quantity
            )
            VALUES ($1, $2)
            `,
            [
                product.id,
                quantity || 0
            ]
        );

        await client.query("COMMIT");

        res.status(201).json({
            message: "Produkt został dodany.",
            product
        });

    } catch (error) {
        await client.query("ROLLBACK");

        console.error("Błąd dodawania produktu:", error);

        res.status(500).json({
            error: "Nie udało się dodać produktu."
        });

    } finally {
        client.release();
    }
});

module.exports = router;
