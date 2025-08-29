# 📘 Backend Service - Backtesting Microservice

## 🚀 Overview

This service provides a backtesting engine for trading strategies. It connects to PostgreSQL (to fetch historical candle data), integrates with RabbitMQ (for async job handling), and exposes REST APIs via Express.js.

## ⚙️ Features

-   Fetch historical data from DB
-   Trigger backtests via API
-   Support multiple strategies (Moving Average, RSI, Bollinger Bands, MACD)
-   Store results into PostgreSQL
-   Async job processing with RabbitMQ
-   Worker service to process backtests
-   REST API to fetch backtest results
-   Indicators library (`technicalindicators`) for frontend charting

## 📂 Folder Structure

```
backtesting_service/
├── server.js                # Entry point
├── package.json
├── .env.example             # Example environment variables
├── README.md                # This file
├── README-react.md          # Frontend usage guide
└── src/
    ├── config/
    │   ├── db.js            # PostgreSQL connection
    │   ├── rabbitmq.js      # RabbitMQ connection
    │   └── initDb.js        # Auto-create tables
    ├── strategies/          # Backtesting strategies
    │   ├── movingAverage.js
    │   ├── rsi.js
    │   ├── bollingerBands.js
    │   └── macd.js
    ├── workers/
    │   └── backtestWorker.js
    ├── routes/
    │   └── backtestRoutes.js
    ├── controllers/
    │   └── backtestController.js
    ├── services/
    │   ├── candleService.js
    │   └── backtestService.js
    └── utils/
        └── indicators.js
```

## 🔧 Installation

```bash
# Clone repo
git clone <repo-url>
cd backtesting_service

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

## ⚙️ Environment Variables (`.env`)

```
# Server
PORT=3000
NODE_ENV=development

# PostgreSQL
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tradingdb

# RabbitMQ
RABBITMQ_URL=amqp://localhost
```

## ▶️ Run Service

```bash
npm start
```

## 🧪 Run Tests

```bash
npm test
```

This will:

-   Run a sample backtest (BTCUSDT)
-   Insert result into DB
-   Fetch stored results

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

## 🛠 Strategies Implemented

-   Moving Average Crossover
-   RSI (Relative Strength Index)
-   Bollinger Bands
-   MACD

Each strategy is modular (separate file under `src/strategies`).

## 📦 Tech Stack

-   **Node.js** + Express.js
-   **PostgreSQL** (candles + backtest results)
-   **RabbitMQ** (async job processing)
-   **technicalindicators** (indicators)

## ✅ Worker

The worker (`src/workers/backtestWorker.js`) consumes jobs from RabbitMQ and executes backtests asynchronously.

## 🔮 Next Steps

-   Add more strategies
-   Optimize performance with streaming
-   Add user authentication

---

📌 Author: Backtesting Microservice Team
