const WebSocket = require("ws");
const { saveCandle } = require("../repositories/candleRepository");
const { getChannel } = require("../config/rabbitmq");

const observers = new Map(); // symbol -> [ws clients]

function subscribe(symbol, ws) {
    if (!observers.has(symbol)) {
        observers.set(symbol, []);
        connectBinanceStream(symbol);
    }
    observers.get(symbol).push(ws);
}

function unsubscribe(symbol, ws) {
    if (!observers.has(symbol)) return;
    observers.set(
        symbol,
        observers.get(symbol).filter((c) => c !== ws),
    );
}

function broadcast(symbol, data) {
    if (!observers.has(symbol)) return;
    observers
        .get(symbol)
        .forEach((ws) => ws.send(JSON.stringify({ symbol, data })));
}

async function connectBinanceStream(symbol) {
    const url = `wss://stream.binance.com:9443/ws/${symbol}@kline_1m`;
    const ws = new WebSocket(url);

    ws.on("message", async (msg) => {
        const data = JSON.parse(msg);
        const candle = {
            open: data.k.o,
            high: data.k.h,
            low: data.k.l,
            close: data.k.c,
            volume: data.k.v,
            timestamp: data.k.t,
        };

        // Lưu DB
        await saveCandle(symbol, candle);

        // Gửi WebSocket client
        broadcast(symbol, candle);

        // Publish sang RabbitMQ
        const channel = getChannel();
        channel.publish(
            "candles",
            "",
            Buffer.from(JSON.stringify({ symbol, candle })),
        );
    });
}

module.exports = { subscribe, unsubscribe };
