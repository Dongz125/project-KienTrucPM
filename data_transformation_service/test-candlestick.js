const WebSocket = require("ws");

// Cặp tiền muốn test
const SYMBOL = "btcusdt"; // ethusdt, bnbusdt ...
const INTERVAL = "1m"; // 1m, 5m, 15m, 1h, 1d...

// URL Binance WebSocket
const BINANCE_WS_URL = `wss://stream.binance.com:9443/ws/${SYMBOL}@kline_${INTERVAL}`;

console.log(`Kết nối Binance WS: ${BINANCE_WS_URL}`);

const ws = new WebSocket(BINANCE_WS_URL);

ws.on("open", () => {
    console.log("Đã kết nối tới Binance WebSocket");
});

ws.on("message", (msg) => {
    const data = JSON.parse(msg);

    // Lấy dữ liệu nến
    const kline = data.k; // k là object chứa thông tin nến
    const candle = {
        openTime: new Date(kline.t).toISOString(),
        open: kline.o,
        high: kline.h,
        low: kline.l,
        close: kline.c,
        volume: kline.v,
        closeTime: new Date(kline.T).toISOString(),
        isClosed: kline.x, // true khi nến kết thúc
    };

    console.log("Candle:", candle);
});

ws.on("error", (err) => {
    console.error("Lỗi:", err.message);
});

ws.on("close", () => {
    console.log("Đã ngắt kết nối Binance");
});
