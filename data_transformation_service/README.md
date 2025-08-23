# 🚀 Data Transformation Service

**Data Transformation Service**

## ✨ Tính năng chính

-   🔄 **Real-time Data Streaming**: Kết nối trực tiếp với Binance WebSocket để nhận dữ liệu nến real-time
-   📊 **Candlestick Data**: Xử lý và chuyển đổi dữ liệu nến từ Binance
-   👥 **Multi-user Support**: Hỗ trợ nhiều người dùng cùng lúc, mỗi user tối đa 4 cặp tiền
-   💾 **Database Storage**: Lưu trữ dữ liệu vào PostgreSQL cho backtesting
-   🔌 **Message Queue**: Tích hợp RabbitMQ để giao tiếp với các service khác
-   🌐 **WebSocket API**: Cung cấp WebSocket endpoint cho frontend real-time
-   🏥 **Health Check**: API kiểm tra trạng thái service

## 📁 Cấu trúc thư mục

```
data-transformation-service/
├── src/
│   ├── config/
│   │   ├── database.js          # Cấu hình PostgreSQL
│   │   └── rabbitmq.js          # Cấu hình RabbitMQ
│   ├── controllers/
│   │   └── streamController.js  # Xử lý WebSocket connections
│   ├── services/
│   │   ├── userSessionService.js # Quản lý session user
│   │   └── streamService.js     # Xử lý streaming data
│   ├── repositories/
│   │   └── candleRepository.js  # Tương tác với database
│   └── app.js                   # Express app setup
├── server.js                    # Entry point
├── package.json                 # Dependencies
├── .env                         # Environment variables
├── docker-compose.yml           # Docker services
└── test-candlestick.js          # Test script
```

## 🛠️ Cài đặt

### Yêu cầu hệ thống

-   Node.js >= 14
-   PostgreSQL >= 13
-   RabbitMQ >= 3.8
-   Docker & Docker Compose (tùy chọn)

### Cài đặt thủ công

1. **Clone repository**

```bash
git clone <repository-url>
cd data-transformation-service
```

2. **Cài đặt dependencies**

```bash
npm install
```

3. **Cấu hình environment**

```bash
cp .env.example .env
# Chỉnh sửa .env theo cấu hình của bạn
```

4. **Khởi động PostgreSQL**

```bash
# Sử dụng Docker
docker run -d --name postgres \
  -e POSTGRES_DB=dbname \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=dbpassword \
  -p 5432:5432 \
  postgres:15

# Hoặc cài đặt PostgreSQL locally
```

5. **Khởi động RabbitMQ**

```bash
# Sử dụng Docker
docker run -d --name rabbitmq \
  -e RABBITMQ_DEFAULT_USER=guest \
  -e RABBITMQ_DEFAULT_PASS=guest \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:3-management

# Hoặc cài đặt RabbitMQ locally
```

6. **Tạo database schema**

```sql
CREATE TABLE candles (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL,
    open DECIMAL(20,8) NOT NULL,
    high DECIMAL(20,8) NOT NULL,
    low DECIMAL(20,8) NOT NULL,
    close DECIMAL(20,8) NOT NULL,
    volume DECIMAL(20,8) NOT NULL,
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_candles_symbol_timestamp ON candles(symbol, timestamp);
```

7. **Khởi động service**

```bash
npm start
```

### Cài đặt với Docker

1. **Khởi động các services**

```bash
docker compose up --build
```

2. **Chạy service**

```bash
npm start
```

## 📡 API Endpoints

### Health Check

```http
GET /health
```

**Response:**

```json
{
    "status": "ok",
    "service": "data-transformation-service"
}
```

## 🔌 WebSocket API

### Kết nối WebSocket

```
ws://localhost:3000?user=USER_ID
```

### Các actions hỗ trợ

#### 1. Subscribe to symbol

```json
{
    "action": "subscribe",
    "symbol": "btcusdt"
}
```

#### 2. Unsubscribe from symbol

```json
{
    "action": "unsubscribe",
    "symbol": "btcusdt"
}
```

#### 3. Replace symbol

```json
{
    "action": "replace",
    "oldSymbol": "btcusdt",
    "symbol": "ethusdt"
}
```

### Nhận dữ liệu

```json
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

## 🧪 Testing

### Test WebSocket connection

```bash
node test-candlestick.js
```

### Test với curl

```bash
# Health check
curl http://localhost:3000/health

# Test WebSocket (sử dụng wscat hoặc Postman)
wscat -c "ws://localhost:3000?user=test123"
```

## 📊 Database Schema

### Bảng `candles`

```sql
CREATE TABLE candles (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL,
    open DECIMAL(20,8) NOT NULL,
    high DECIMAL(20,8) NOT NULL,
    low DECIMAL(20,8) NOT NULL,
    close DECIMAL(20,8) NOT NULL,
    volume DECIMAL(20,8) NOT NULL,
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔄 Message Queue (RabbitMQ)

Service sử dụng RabbitMQ để publish dữ liệu nến cho các service khác:

-   **Exchange**: `candles` (fanout)
-   **Message format**:

```json
{
    "symbol": "btcusdt",
    "candle": {
        "open": "45000.00",
        "high": "45100.00",
        "low": "44900.00",
        "close": "45050.00",
        "volume": "100.5",
        "timestamp": 1640995200000
    }
}
```

## 🎯 Design Patterns

### 1. Observer Pattern

-   Sử dụng trong `streamService.js` để quản lý WebSocket clients
-   Mỗi symbol có một danh sách observers (clients)

### 2. Repository Pattern

-   `candleRepository.js` đóng gói logic tương tác với database
-   Tách biệt business logic khỏi data access

### 3. Service Layer Pattern

-   `userSessionService.js` và `streamService.js` chứa business logic
-   Tách biệt logic khỏi controllers

## 📈 Monitoring

### Logs

Service tự động log các events:

-   WebSocket connections/disconnections
-   Symbol subscriptions
-   Database operations
-   RabbitMQ publishing

### Health Check

```bash
curl http://localhost:3000/health
```

## 🔧 Troubleshooting

### Lỗi thường gặp

1. **WebSocket connection failed**

    - Kiểm tra Binance API status
    - Verify network connectivity

2. **Database connection error**

    - Kiểm tra PostgreSQL service
    - Verify database credentials

3. **RabbitMQ connection error**
    - Kiểm tra RabbitMQ service
    - Verify connection URL

### Debug mode

```bash
DEBUG=* npm start
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

MIT License

## 📞 Support

Nếu có vấn đề, vui lòng tạo issue trên GitHub repository.
