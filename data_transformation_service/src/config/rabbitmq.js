require("dotenv").config();
const amqp = require("amqplib");

let channel = null;

async function connectRabbitMQ() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();

    await channel.assertExchange(process.env.RABBITMQ_EXCHANGE, "fanout", {
        durable: true,
    });

    console.log("RabbitMQ connected");

    return channel;
}

function getChannel() {
    if (!channel) {
        throw new Error("RabbitMQ chưa kết nối");
    }

    return channel;
}

module.exports = { connectRabbitMQ, getChannel };
