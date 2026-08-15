const express = require("express");
const pool = require("./db");

const router = express.Router();

// Sprawdzenie połączenia z bazą
router.get("/api/database/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      status: "ok",
      database: "connected",
      time: result.rows[0].now
    });
  } catch (error) {
    console.error("Błąd połączenia z bazą:", error);

    res.status(500).json({
      status: "error",
      database: "disconnected"
    });
  }
});

module.exports = router;
