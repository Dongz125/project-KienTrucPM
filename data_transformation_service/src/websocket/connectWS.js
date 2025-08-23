const WebSocket = require("ws");
const { handleUserConnection } = require("../controllers/streamController");

const connectWS = async (server) => {
    try {
        const wss = new WebSocket.Server({ server });

        wss.on("connection", (ws, req) => {
            // Ví dụ: lấy userId từ query string (ws://host:3000?user=abc)
            const userId = req.url.split("?user=")[1] || "guest";
            console.log(`User ${userId} connected`);
            handleUserConnection(ws, userId);
        });

        wss.on("close", () => {
            console.log("WebSocket disconnected");
        });
    } catch (error) {
        console.log("WSS failed connect: ", error);
    }
};

module.exports = connectWS;
