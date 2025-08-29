const { getChannel } = require("../config/rabbitmq");
const BacktestService = require("../services/backtestService");

async function startWorker() {
    const channel = getChannel();
    if (!channel)
        return console.error("Worker cannot start, no RabbitMQ channel");

    channel.consume("backtestQueue", async (msg) => {
        const { symbol, start, end, strategy, params } = JSON.parse(
            msg.content.toString(),
        );
        console.log("Worker received job", { symbol, strategy });

        await BacktestService.runBacktest(symbol, start, end, strategy, params);

        channel.ack(msg);
    });
}

module.exports = startWorker;
