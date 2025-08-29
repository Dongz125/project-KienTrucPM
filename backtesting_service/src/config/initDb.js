// src/config/initDb.js
const pool = require("./db");

async function initDb() {
    const client = await pool.connect();

    try {
        // Bảng lưu dữ liệu nến (candles)
        await client.query(`
            CREATE TABLE IF NOT EXISTS candles (
                id SERIAL PRIMARY KEY,
                symbol VARCHAR(20) NOT NULL,
                open DECIMAL(20,8) NOT NULL,
                high DECIMAL(20,8) NOT NULL,
                low DECIMAL(20,8) NOT NULL,
                close DECIMAL(20,8) NOT NULL,
                volume DECIMAL(20,8) NOT NULL,
                timestamp BIGINT NOT NULL
            );
        `);

        // Bảng lưu kết quả backtest
        await client.query(`
            CREATE TABLE IF NOT EXISTS backtest_results (
                id SERIAL PRIMARY KEY,
                symbol VARCHAR(20) NOT NULL,
                strategy VARCHAR(50) NOT NULL,
                start_time BIGINT NOT NULL,
                end_time BIGINT NOT NULL,
                profit_loss DECIMAL(20,8),
                win_rate DECIMAL(5,2),
                trades JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("✅ Database initialized (candles + backtest_results)");
    } catch (err) {
        console.error("❌ DB init error", err);
    } finally {
        client.release();
    }
}

module.exports = initDb;
