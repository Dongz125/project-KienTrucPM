const { RSI } = require("technicalindicators");

const rsi = {
    run: (candles, options = { period: 14, overbought: 70, oversold: 30 }) => {
        const closes = candles.map((c) => parseFloat(c.close));
        const values = RSI.calculate({
            period: options.period,
            values: closes,
        });

        let profit = 0;
        let trades = 0;
        let wins = 0;
        let position = null;
        let entryPrice = null;

        candles.forEach((c, i) => {
            if (i < options.period) return;
            const rsiValue = values[i - options.period];
            if (!rsiValue) return;

            if (!position && rsiValue < options.oversold) {
                position = "long";
                entryPrice = closes[i];
            } else if (position === "long" && rsiValue > options.overbought) {
                profit += closes[i] - entryPrice;
                trades++;
                if (closes[i] > entryPrice) wins++;
                position = null;
            }
        });

        return {
            profit_loss: profit,
            trades_count: trades,
            win_rate: trades > 0 ? (wins / trades) * 100 : 0,
        };
    },
};

module.exports = rsi;
