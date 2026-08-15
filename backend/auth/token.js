const jwt = require("jsonwebtoken");

function createToken(user) {
    if (!process.env.JWT_SECRET) {
        throw new Error("Brak JWT_SECRET.");
    }

    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "2h"
        }
    );
}

function verifyToken(token) {
    if (!process.env.JWT_SECRET) {
        throw new Error("Brak JWT_SECRET.");
    }

    return jwt.verify(
        token,
        process.env.JWT_SECRET
    );
}

module.exports = {
    createToken,
    verifyToken
};
