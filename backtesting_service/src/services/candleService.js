const pool = require("../config/db");

const CandleService = {
    async getCandles(symbol, start, end) {
        const query = `
      SELECT * FROM candles
      WHERE symbol = $1 AND timestamp BETWEEN $2 AND $3
      ORDER BY timestamp ASC
    `;
        const { rows } = await pool.query(query, [symbol, start, end]);
        return rows;
    },
};

module.exports = CandleService;
