const pool = require("../config/database");

async function saveCandle(symbol, candle) {
    const query = `
    INSERT INTO candles(symbol, open, high, low, close, volume, timestamp)
    VALUES($1,$2,$3,$4,$5,$6,$7)
  `;
    await pool.query(query, [
        symbol,
        candle.open,
        candle.high,
        candle.low,
        candle.close,
        candle.volume,
        candle.timestamp,
    ]);
}

module.exports = { saveCandle };
