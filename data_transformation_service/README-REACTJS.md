# 🎨 Hướng dẫn vẽ sơ đồ nến từ React.js

Hướng dẫn đơn giản cách sử dụng Data Transformation Service để vẽ biểu đồ candlestick real-time trong React.js.

## 📋 Yêu cầu

- Data Transformation Service đang chạy trên `localhost:3000`
- React project đã tạo
- Cài đặt: `npm install lightweight-charts`

---

## 🔌 Bước 1: Tạo WebSocket Hook

```javascript
// src/hooks/useWebSocket.js
import { useEffect, useRef, useState, useCallback } from 'react';

export const useWebSocket = (userId) => {
  const [candles, setCandles] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3000?user=${userId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('✅ Connected to Data Service');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.symbol && data.data) {
        setCandles(prev => {
          const symbolData = prev[data.symbol] || [];
          const newCandle = {
            ...data.data,
            time: parseInt(data.data.timestamp) / 1000
          };
          
          const updatedData = [...symbolData, newCandle];
          // Giữ tối đa 100 candles
          if (updatedData.length > 100) {
            return {
              ...prev,
              [data.symbol]: updatedData.slice(-100)
            };
          }
          
          return {
            ...prev,
            [data.symbol]: updatedData
          };
        });
      }
    };

    ws.onclose = () => setIsConnected(false);

    return () => ws.close();
  }, [userId]);

  const subscribe = useCallback((symbol) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify({
        action: 'subscribe',
        symbol: symbol.toLowerCase()
      }));
    }
  }, [isConnected]);

  const unsubscribe = useCallback((symbol) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify({
        action: 'unsubscribe',
        symbol: symbol.toLowerCase()
      }));
    }
  }, [isConnected]);

  return { candles, isConnected, subscribe, unsubscribe };
};
```

---

## 📊 Bước 2: Tạo Candlestick Chart Component

```javascript
// src/components/CandlestickChart.jsx
import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const CandlestickChart = ({ symbol, candles, width = 600, height = 400 }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width,
      height,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    chartRef.current = { chart, candlestickSeries };

    return () => chart.remove();
  }, []);

  useEffect(() => {
    if (chartRef.current && candles && candles.length > 0) {
      const candlestickData = candles.map(candle => ({
        time: candle.time,
        open: parseFloat(candle.open),
        high: parseFloat(candle.high),
        low: parseFloat(candle.low),
        close: parseFloat(candle.close),
      }));

      chartRef.current.candlestickSeries.setData(candlestickData);
    }
  }, [candles]);

  return (
    <div>
      <h3>{symbol.toUpperCase()} - {candles.length} candles</h3>
      <div ref={chartContainerRef} />
    </div>
  );
};

export default CandlestickChart;
```

---

## 🎯 Bước 3: Sử dụng cho 1 Symbol

```javascript
// src/App.jsx - Trường hợp 1 symbol
import React, { useEffect } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import CandlestickChart from './components/CandlestickChart';

const App = () => {
  const { candles, isConnected, subscribe, unsubscribe } = useWebSocket('user123');
  const symbol = 'btcusdt';

  useEffect(() => {
    subscribe(symbol);
    return () => unsubscribe(symbol);
  }, [subscribe, unsubscribe]);

  return (
    <div>
      <h1>🚀 Crypto Chart - {symbol.toUpperCase()}</h1>
      <p>Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>
      
      <CandlestickChart
        symbol={symbol}
        candles={candles[symbol] || []}
        width={800}
        height={400}
      />
    </div>
  );
};

export default App;
```

---

## 🎯 Bước 4: Sử dụng cho nhiều Symbols

```javascript
// src/App.jsx - Trường hợp nhiều symbols
import React, { useState, useEffect } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import CandlestickChart from './components/CandlestickChart';

const App = () => {
  const [selectedSymbols, setSelectedSymbols] = useState(['btcusdt', 'ethusdt']);
  const { candles, isConnected, subscribe, unsubscribe } = useWebSocket('user123');

  // Subscribe tất cả symbols
  useEffect(() => {
    selectedSymbols.forEach(symbol => {
      subscribe(symbol);
    });

    return () => {
      selectedSymbols.forEach(symbol => {
        unsubscribe(symbol);
      });
    };
  }, [selectedSymbols, subscribe, unsubscribe]);

  const addSymbol = (symbol) => {
    if (selectedSymbols.length < 4 && !selectedSymbols.includes(symbol)) {
      setSelectedSymbols([...selectedSymbols, symbol]);
    }
  };

  const removeSymbol = (symbol) => {
    setSelectedSymbols(selectedSymbols.filter(s => s !== symbol));
  };

  return (
    <div>
      <h1>🚀 Multi Crypto Charts</h1>
      <p>Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>
      
      {/* Symbol Selector */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => addSymbol('btcusdt')}>Add BTC</button>
        <button onClick={() => addSymbol('ethusdt')}>Add ETH</button>
        <button onClick={() => addSymbol('adausdt')}>Add ADA</button>
        <button onClick={() => addSymbol('solusdt')}>Add SOL</button>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))', gap: '20px' }}>
        {selectedSymbols.map(symbol => (
          <div key={symbol} style={{ border: '1px solid #ddd', padding: '10px' }}>
            <button onClick={() => removeSymbol(symbol)} style={{ float: 'right' }}>×</button>
            <CandlestickChart
              symbol={symbol}
              candles={candles[symbol] || []}
              width={600}
              height={400}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
```

---

## 📤 Input/Output

### **React gửi tới Service:**
```javascript
// Kết nối
ws://localhost:3000?user=user123

// Subscribe
{
  "action": "subscribe",
  "symbol": "btcusdt"
}

// Unsubscribe
{
  "action": "unsubscribe", 
  "symbol": "btcusdt"
}
```

### **React nhận từ Service:**
```javascript
// Candlestick data
{
  "symbol": "btcusdt",
  "data": {
    "open": "45000.00",
    "high": "45100.00",
    "low": "44900.00", 
    "close": "45050.00",
    "volume": "100.5",
    "timestamp": 1640995200000
  }
}
```

---

## 🚀 Chạy ứng dụng

```bash
# 1. Đảm bảo Data Transformation Service đang chạy
curl http://localhost:3000/health

# 2. Tạo React project
npx create-react-app crypto-charts
cd crypto-charts

# 3. Cài đặt dependencies
npm install lightweight-charts

# 4. Copy code trên vào project

# 5. Chạy
npm start
```

---

## 🎯 Kết quả

- **1 Symbol**: Hiển thị 1 biểu đồ candlestick real-time
- **Nhiều Symbols**: Hiển thị nhiều biểu đồ cùng lúc (tối đa 4)
- **Real-time**: Dữ liệu cập nhật liên tục từ Binance
- **Responsive**: Tự động điều chỉnh kích thước

---

## 🔧 Troubleshooting

```bash
# Kiểm tra service
curl http://localhost:3000/health

# Kiểm tra WebSocket
# Mở browser console để xem logs
```

Với hướng dẫn này, bạn có thể dễ dàng tạo biểu đồ candlestick real-time trong React.js!
