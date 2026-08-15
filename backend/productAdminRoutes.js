const express = require("express");
const pool = require("./db");

const router = express.Router();

router.post("/api/admin/products", async (req, res) => {
    try {
        const {
            name,
            description,
            sku,
            price,
            category_id
        } = req.body;

        if (!name || !price || !category_id) {
            return res.status(400).json({
                error: "Nazwa, cena i kategoria są wymagane."
            });
        }

        const slug = name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9ąćęłńóśźż\s-]/gi, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

        const result = await pool.query(
            `
            INSERT INTO products
                (category_id, name, slug, description, sku, price)
            VALUES
                ($1, $2, $3, $4, $5, $6)
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

        res.status(201).json({
            message: "Produkt został dodany.",
            product: result.rows[0]
        });

    } catch (error) {
        console.error("Błąd dodawania produktu:", error);

        res.status(500).json({
            error: "Nie udało się dodać produktu."
        });
    }
});

module.exports = router;
