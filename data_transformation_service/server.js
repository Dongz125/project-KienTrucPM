require("dotenv").config();
const app = require("./src/app");
const pool = require("./src/config/database");
const { connectRabbitMQ } = require("./src/config/rabbitmq");
const connectWS = require("./src/websocket/connectWS");

async function start() {
  try {
    // Kết nối RabbitMQ
    await connectRabbitMQ();

    // Khởi động Express HTTP server
    const server = app.listen(process.env.PORT || 3000, () =>
      console.log(
        `Data Transformation Service chạy trên cổng ${
          process.env.PORT || 3000
        }`,
      ),
    );

    // Khởi động WebSocket server
    connectWS(server);

    // Setup the actual database if not there yet.
    const result = await pool.query(`
      CREATE TABLE IF NOT EXISTS candles (
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
  `);
    console.log(result);
  } catch (err) {
    console.error("Service start error:", err);
    process.exit(1);
  }
}

start();
