const { verifyToken } = require("./token");

function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "Wymagane logowanie."
            });
        }

        const token = authHeader.substring(7);
        const user = verifyToken(token);

        req.user = user;

        next();

    } catch (error) {
        console.error("Błąd autoryzacji:", error);

        return res.status(401).json({
            error: "Nieprawidłowa lub wygasła sesja."
        });
    }
}

function requireAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            error: "Wymagane logowanie."
        });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            error: "Brak uprawnień administratora."
        });
    }

    next();
}

module.exports = {
    requireAuth,
    requireAdmin
};
