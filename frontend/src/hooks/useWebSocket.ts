import { useEffect, useRef, useState, useCallback } from "react";

export const useWebSocket = (userId) => {
  const [candles, setCandles] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3000?user=${userId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ Connected to Data Service");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.symbol && data.data) {
        setCandles((prev) => {
          const symbolData = prev[data.symbol] || [];
          const newCandle = {
            ...data.data,
            time: parseInt(data.data.timestamp) / 1000,
          };

          const updatedData = [...symbolData, newCandle];
          // Giữ tối đa 100 candles
          if (updatedData.length > 100) {
            return {
              ...prev,
              [data.symbol]: updatedData.slice(-100),
            };
          }

          return {
            ...prev,
            [data.symbol]: updatedData,
          };
        });
      }
    };

    ws.onclose = () => setIsConnected(false);

    return () => ws.close();
  }, [userId]);

  const subscribe = useCallback(
    (symbol) => {
      if (wsRef.current && isConnected) {
        wsRef.current.send(
          JSON.stringify({
            action: "subscribe",
            symbol: symbol.toLowerCase(),
          }),
        );
      }
    },
    [isConnected],
  );

  const unsubscribe = useCallback(
    (symbol) => {
      if (wsRef.current && isConnected) {
        wsRef.current.send(
          JSON.stringify({
            action: "unsubscribe",
            symbol: symbol.toLowerCase(),
          }),
        );
      }
    },
    [isConnected],
  );

  return { candles, isConnected, subscribe, unsubscribe };
};
