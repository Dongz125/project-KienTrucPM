// server.js
const express = require("express");
const bodyParser = require("express").json; // express.json()
const { config } = require("./config/index");
const { initDb } = require("./config/db");
const { connect: connectRedis } = require("./config/redis");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(bodyParser());
app.use("/api/auth", authRoutes.init());

// health
app.get("/health", (req, res) => res.json({ status: "ok" }));

const start = async () => {
    try {
        await initDb();
        await connectRedis();
        app.listen(config.port, () => {
            console.log(`Auth service listening on port ${config.port}`);
        });
    } catch (err) {
        console.error("Failed to start", err);
        process.exit(1);
    }
};

start();
