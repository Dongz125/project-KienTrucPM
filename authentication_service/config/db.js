// config/db.js
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
const { config } = require("./index");

const pool = new Pool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
});

const query = (text, params) => pool.query(text, params);

const initDb = async () => {
    const file = path.join(__dirname, "..", "sql", "init.sql");
    const sql = fs.readFileSync(file).toString();
    await pool.query(sql);
    console.log("DB initialized (users table ready).");
};

module.exports = { pool, query, initDb };
