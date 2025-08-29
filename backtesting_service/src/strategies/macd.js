const { MACD } = require("technicalindicators");

const macd = {
    run: (
        candles,
        options = {
            fastPeriod: 12,
            slowPeriod: 26,
            signalPeriod: 9,
            SimpleMAOscillator: false,
            SimpleMASignal: false,
        },
    ) => {
        const closes = candles.map((c) => parseFloat(c.close));
        const macdValues = MACD.calculate({
            values: closes,
            fastPeriod: options.fastPeriod,
            slowPeriod: options.slowPeriod,
            signalPeriod: options.signalPeriod,
            SimpleMAOscillator: options.SimpleMAOscillator,
            SimpleMASignal: options.SimpleMASignal,
        });

        let profit = 0;
        let trades = 0;
        let wins = 0;
        let position = null;
        let entryPrice = null;

        candles.forEach((c, i) => {
            if (i < options.slowPeriod) return;
            const m = macdValues[i - options.slowPeriod];
            if (!m) return;

            if (!position && m.MACD > m.signal) {
                position = "long";
                entryPrice = closes[i];
            } else if (position === "long" && m.MACD < m.signal) {
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

module.exports = macd;
