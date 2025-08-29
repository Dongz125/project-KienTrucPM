const { SMA } = require("technicalindicators");

const MovingAverageStrategy = {
    run(candles, params = { short: 10, long: 20 }) {
        const closes = candles.map((c) => parseFloat(c.close));

        const shortMA = SMA.calculate({ period: params.short, values: closes });
        const longMA = SMA.calculate({ period: params.long, values: closes });

        let position = null;
        let profit = 0;
        let trades = [];

        for (let i = params.long; i < closes.length; i++) {
            if (
                !position &&
                shortMA[i - params.long] > longMA[i - params.long]
            ) {
                position = closes[i];
                trades.push({
                    action: "BUY",
                    price: closes[i],
                    time: candles[i].timestamp,
                });
            } else if (
                position &&
                shortMA[i - params.long] < longMA[i - params.long]
            ) {
                profit += closes[i] - position;
                trades.push({
                    action: "SELL",
                    price: closes[i],
                    time: candles[i].timestamp,
                });
                position = null;
            }
        }

        return {
            profit_loss: profit,
            win_rate:
                trades.filter((t) => t.action === "SELL" && t.price > position)
                    .length / (trades.length / 2 || 1),
            trades,
        };
    },
};

module.exports = MovingAverageStrategy;
