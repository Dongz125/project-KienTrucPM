import express from "express";
import { crawlReddit } from "../dispatchers/reddit-dispatch";
import { crawlStocktwit } from "../dispatchers/stocktwit-dispatch";

async function sendMessage(combinedData: any) {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect("amqp://localhost"); // change URI if needed
    const channel = await connection.createChannel();

    const queue = "crawler";

    // Ensure the queue exists
    await channel.assertQueue(queue, { durable: true });

    // Publish the message as JSON
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(combinedData)), {
      contentType: "application/json",
      persistent: true,
    });

    console.log(" [x] Sent message to %s", queue);

    // Close connection after a short delay to let message flush
    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (err) {
    console.error("RabbitMQ error:", err);
  }
}

async function getCrawl(req: express.Request, res: express.Response) {
  const [redditResults, stocktwitResults] = await Promise.all([
    crawlReddit(),
    crawlStocktwit(),
  ]);
  res.status(200).json({
    reddit: redditResults,
    stocktwit: stocktwitResults,
  });
}

export { getCrawl };
