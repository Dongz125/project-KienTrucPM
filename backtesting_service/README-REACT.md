# 📗 Frontend Usage Guide (React)

## 🚀 Overview

This document explains how to integrate the Backtesting Microservice with a React frontend. The backend exposes REST APIs for running backtests and fetching results, which can be visualized in charts.

## 📡 API Endpoints

### Run Backtest

```http
POST /api/backtest
```

**Request Body:**

```json
{
    "symbol": "BTCUSDT",
    "start": 1620000000000,
    "end": 1621000000000,
    "strategy": "movingAverage",
    "params": { "short": 5, "long": 10 }
}
```

**Response:**

```json
{
  "profit_loss": 123.45,
  "win_rate": 60.5,
  "trades": [ ... ]
}
```

### Get Backtest Results

```http
GET /api/backtest/results
```

**Response:**

```json
[
  {
    "id": 1,
    "symbol": "BTCUSDT",
    "strategy": "movingAverage",
    "profit_loss": 123.45,
    "win_rate": 60.5,
    "trades": [ ... ],
    "created_at": "2025-08-29T10:00:00Z"
  }
]
```

## ⚛️ React Integration Example

### API Helper (`api.js`)

```javascript
import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const runBacktest = (data) => axios.post(`${API_URL}/backtest`, data);
export const getResults = () => axios.get(`${API_URL}/backtest/results`);
```

### Component Example (`BacktestForm.js`)

```javascript
import React, { useState } from "react";
import { runBacktest } from "./api";

export default function BacktestForm() {
    const [symbol, setSymbol] = useState("BTCUSDT");
    const [strategy, setStrategy] = useState("movingAverage");
    const [result, setResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data } = await runBacktest({
            symbol,
            start: 1620000000000,
            end: 1621000000000,
            strategy,
            params: { short: 5, long: 10 },
        });
        setResult(data);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                />
                <select
                    value={strategy}
                    onChange={(e) => setStrategy(e.target.value)}
                >
                    <option value="movingAverage">Moving Average</option>
                    <option value="rsi">RSI</option>
                    <option value="bollinger">Bollinger Bands</option>
                    <option value="macd">MACD</option>
                </select>
                <button type="submit">Run Backtest</button>
            </form>

            {result && (
                <div>
                    <h3>Result</h3>
                    <p>Profit/Loss: {result.profit_loss}</p>
                    <p>Win Rate: {result.win_rate}%</p>
                </div>
            )}
        </div>
    );
}
```

### Display Results in Chart (`BacktestChart.js`)

```javascript
import React, { useEffect, useState } from "react";
import { getResults } from "./api";
import { Line } from "react-chartjs-2";

export default function BacktestChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        (async () => {
            const res = await getResults();
            setData(res.data);
        })();
    }, []);

    return (
        <Line
            data={{
                labels: data.map((r) => r.created_at),
                datasets: [
                    {
                        label: "Profit/Loss",
                        data: data.map((r) => r.profit_loss),
                        borderColor: "blue",
                        fill: false,
                    },
                ],
            }}
        />
    );
}
```

## 📦 Required Dependencies

```bash
npm install axios react-chartjs-2 chart.js
```

## 🔮 Next Steps

-   Add parameter controls in the form
-   Allow multiple strategies comparison
-   Visualize trades on candlestick chart

---

📌 Author: Backtesting Microservice Team
