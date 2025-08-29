const pool = require("../config/db");

const dataFetcher = {
    getCandles: async (symbol, startTime, endTime) => {
        const res = await pool.query(
            `SELECT * FROM candles 
       WHERE symbol = $1 
         AND timestamp BETWEEN $2 AND $3
       ORDER BY timestamp ASC`,
            [symbol, startTime, endTime],
        );
        return res.rows;
    },
};

module.exports = dataFetcher;
