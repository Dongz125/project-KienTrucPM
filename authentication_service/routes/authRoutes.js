// routes/authRoutes.js
const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

const authRoutes = {
    router,
    init() {
        router.post("/register", authController.register);
        router.post("/login", authController.login);
        router.post("/refresh", authController.refresh);
        router.post("/logout", authController.logout);
        return router;
    },
};

module.exports = authRoutes;
