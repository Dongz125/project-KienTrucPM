// middlewares/authMiddleware.js
const tokenService = require("../services/tokenService");

const authMiddleware = {
    requireAuth: (req, res, next) => {
        const header = req.headers.authorization;

        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = header.split(" ")[1];

        try {
            const decoded = tokenService.verifyAccessToken(token);
            req.user = { id: decoded.sub, email: decoded.email };
            next();
        } catch (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
    },
};

module.exports = authMiddleware;
