const pool = require("../config/database");

async function saveCandle(symbol, candle) {
  const query = `
    INSERT INTO candles(symbol, open, high, low, close, volume, timestamp)
    VALUES($1,$2,$3,$4,$5,$6,$7)
  `;
  const result = await pool.query(query, [
    symbol,
    candle.open,
    candle.high,
    candle.low,
    candle.close,
    candle.volume,
    candle.timestamp,
  ]);

  if (result.rowCount == 0) {
    console.error("Failed to insert into database");
  }
}

module.exports = { saveCandle };
