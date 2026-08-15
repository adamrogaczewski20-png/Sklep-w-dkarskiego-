const express = require("express");
const pool = require("../db");
const { hashPassword, verifyPassword } = require("./password");
const { createToken } = require("./token");

const router = express.Router();

// REJESTRACJA
router.post("/api/auth/register", async (req, res) => {
    try {
        const {
            email,
            password,
            first_name,
            last_name
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "E-mail i hasło są wymagane."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                error: "Hasło musi mieć co najmniej 8 znaków."
            });
        }

        const existingUser = await pool.query(
            `
            SELECT id
            FROM users
            WHERE email = $1
            `,
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                error: "Konto z tym adresem e-mail już istnieje."
            });
        }

        const passwordHash = await hashPassword(password);

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
                passwordHash,
                first_name || null,
                last_name || null
            ]
        );

        const user = result.rows[0];
        const token = createToken(user);

        res.status(201).json({
            message: "Konto zostało utworzone.",
            token,
            user
        });

    } catch (error) {
        console.error("Błąd rejestracji:", error);

        res.status(500).json({
            error: "Nie udało się utworzyć konta."
        });
    }
});

// LOGOWANIE
router.post("/api/auth/login", async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "E-mail i hasło są wymagane."
            });
        }

        const result = await pool.query(
            `
            SELECT
                id,
                email,
                password_hash,
                first_name,
                last_name,
                role
            FROM users
            WHERE email = $1
              AND is_active = TRUE
            `,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                error: "Nieprawidłowy e-mail lub hasło."
            });
        }

        const user = result.rows[0];

        const passwordCorrect = await verifyPassword(
            password,
            user.password_hash
        );

        if (!passwordCorrect) {
            return res.status(401).json({
                error: "Nieprawidłowy e-mail lub hasło."
            });
        }

        const token = createToken(user);

        res.json({
            message: "Logowanie udane.",
            token,
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Błąd logowania:", error);

        res.status(500).json({
            error: "Nie udało się zalogować."
        });
    }
});

module.exports = router;
