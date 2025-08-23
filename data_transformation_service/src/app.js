require("dotenv").config();
const express = require("express");

const app = express();

// Middleware
app.use(express.json());

// Health check route
app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "data-transformation-service" });
});

// (nếu cần thêm REST API cho frontend, bạn sẽ thêm ở đây)

module.exports = app;
