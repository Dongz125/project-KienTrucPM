import React, { useEffect, useState } from "react";
import CandlestickChart from "../components/CandlestickChart";
import useWebSocket from "../hooks/useWebSocket";

interface CandleData {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

const TradingViewPage: React.FC = () => {
    const [symbol, setSymbol] = useState("btcusdt");
    const [data, setData] = useState<CandleData[]>([]);

    const { sendJsonMessage, lastJsonMessage } = useWebSocket(
        `ws://localhost:3000?user=frontend-client`,
    );

    // Gửi subscribe khi chọn symbol
    useEffect(() => {
        sendJsonMessage({
            action: "subscribe",
            symbol,
        });
    }, [symbol]);

    // Cập nhật dữ liệu khi nhận từ WS
    useEffect(() => {
        if (lastJsonMessage?.data) {
            const newCandle: CandleData = {
                timestamp: lastJsonMessage.data.timestamp,
                open: parseFloat(lastJsonMessage.data.open),
                high: parseFloat(lastJsonMessage.data.high),
                low: parseFloat(lastJsonMessage.data.low),
                close: parseFloat(lastJsonMessage.data.close),
                volume: parseFloat(lastJsonMessage.data.volume),
            };
            setData((prev) => [...prev.slice(-49), newCandle]); // lưu max 50 điểm
        }
    }, [lastJsonMessage]);

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">TradingView</h1>

            {/* Select cặp tiền */}
            <div className="flex items-center gap-4">
                <select
                    className="border p-2 rounded"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                >
                    <option value="btcusdt">BTC/USDT</option>
                    <option value="ethusdt">ETH/USDT</option>
                    <option value="bnbusdt">BNB/USDT</option>
                </select>
            </div>

            {/* Biểu đồ */}
            <CandlestickChart data={data} />
        </div>
    );
};

export default TradingViewPage;
