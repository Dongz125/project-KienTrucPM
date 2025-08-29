const pool = require("../config/db");
const CandleService = require("./candleService");
const MovingAverage = require("../strategies/movingAverage");
const RSI = require("../strategies/rsi");
const Bollinger = require("../strategies/bollingerBands");
const MACD = require("../strategies/macd");

const strategies = {
    movingAverage: MovingAverage,
    rsi: RSI,
    bollinger: Bollinger,
    macd: MACD,
};

const BacktestService = {
    async runBacktest(symbol, start, end, strategyName, params) {
        const candles = await CandleService.getCandles(symbol, start, end);
        if (!candles.length) return { error: "No data found" };

        const strategy = strategies[strategyName];
        if (!strategy) return { error: "Invalid strategy" };

        const result = strategy.run(candles, params);

        await pool.query(
            `INSERT INTO backtest_results (symbol, strategy, start_time, end_time, profit_loss, win_rate, trades)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
            [
                symbol,
                strategyName,
                start,
                end,
                result.profit_loss,
                result.win_rate,
                JSON.stringify(result.trades),
            ],
        );

        return result;
    },

    async getResults() {
        const { rows } = await pool.query(
            "SELECT * FROM backtest_results ORDER BY created_at DESC",
        );
        return rows;
    },
};

module.exports = BacktestService;
