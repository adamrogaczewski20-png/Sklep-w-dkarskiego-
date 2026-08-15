const express = require("express");
const pool = require("./db");

const router = express.Router();

// Utworzenie klienta
router.post("/api/customers", async (req, res) => {
    try {
        const {
            email,
            first_name,
            last_name,
            phone
        } = req.body;

        if (!email) {
            return res.status(400).json({
                error: "Adres e-mail jest wymagany."
            });
        }

        const existingCustomer = await pool.query(
            `
            SELECT id
            FROM users
            WHERE email = $1
            `,
            [email]
        );

        if (existingCustomer.rows.length > 0) {
            return res.status(409).json({
                error: "Klient z tym adresem e-mail już istnieje."
            });
        }

        const result = await pool.query(
            `
            INSERT INTO users
                (email, password_hash, first_name, last_name, role)
            VALUES
                ($1, $2, $3, $4, 'customer')
            RETURNING
                id,
                email,
                first_name,
                last_name,
                role,
                created_at
            `,
            [
                email,
                "TEMPORARY_PASSWORD",
                first_name || null,
                last_name || null
            ]
        );

        res.status(201).json({
            message: "Klient został utworzony.",
            customer: result.rows[0]
        });

    } catch (error) {
        console.error("Błąd tworzenia klienta:", error);

        res.status(500).json({
            error: "Nie udało się utworzyć klienta."
        });
    }
});

// Pobranie klienta po ID
router.get("/api/customers/:id", async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                id,
                email,
                first_name,
                last_name,
                role,
                created_at
            FROM users
            WHERE id = $1
              AND role = 'customer'
            `,
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Klient nie istnieje."
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error("Błąd pobierania klienta:", error);

        res.status(500).json({
            error: "Nie udało się pobrać klienta."
        });
    }
});

module.exports = router;
