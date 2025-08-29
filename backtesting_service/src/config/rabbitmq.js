const amqp = require("amqplib");
require("dotenv").config();

let channel;

async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue("backtestQueue", { durable: true });
        console.log("✅ Connected to RabbitMQ");
        return channel;
    } catch (err) {
        console.error("❌ RabbitMQ connection error", err);
    }
}

module.exports = { connectRabbitMQ, getChannel: () => channel };
