const { BollingerBands } = require("technicalindicators");

const bollinger = {
    run: (candles, options = { period: 20, stdDev: 2 }) => {
        const closes = candles.map((c) => parseFloat(c.close));
        const bb = BollingerBands.calculate({
            period: options.period,
            stdDev: options.stdDev,
            values: closes,
        });

        let profit = 0;
        let trades = 0;
        let wins = 0;
        let position = null;
        let entryPrice = null;

        candles.forEach((c, i) => {
            if (i < options.period) return;
            const band = bb[i - options.period];
            if (!band) return;

            if (!position && closes[i] < band.lower) {
                position = "long";
                entryPrice = closes[i];
            } else if (position === "long" && closes[i] > band.upper) {
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

module.exports = bollinger;
