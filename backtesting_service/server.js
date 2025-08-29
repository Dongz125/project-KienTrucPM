const express = require("express");
require("dotenv").config();
const initDb = require("./src/config/initDb");
const { connectRabbitMQ } = require("./src/config/rabbitmq");
const backtestRoutes = require("./src/routes/backtestRoutes");
const startWorker = require("./src/workers/backtestWorker");

const app = express();
app.use(express.json());

app.use("/api", backtestRoutes);

const PORT = process.env.PORT || 3000;

(async () => {
    await initDb();
    await connectRabbitMQ();
    startWorker();

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
