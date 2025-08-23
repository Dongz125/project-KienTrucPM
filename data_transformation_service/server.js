require("dotenv").config();
const app = require("./src/app");
const { connectRabbitMQ } = require("./src/config/rabbitmq");
const connectWS = require("./src/websocket/connectWs");

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
    } catch (err) {
        console.error("Service start error:", err);
        process.exit(1);
    }
}

start();
