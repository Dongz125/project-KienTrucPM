import express from "express";
import dotenv from "dotenv";
import { ChannelModel, Channel } from "amqplib";

dotenv.config();

let crawlerService: CrawlerService;

class CrawlerService {
  app: express.Express;
  rabbitmq: ChannelModel;
  channel: Channel;

  async sendMessage(message: any) {
    return this.channel.sendToQueue(
      "crawler",
      Buffer.from(JSON.stringify(message)),
      {
        contentType: "application/json",
      },
    );
  }

  start(port: any, fn: () => void) {
    this.app.listen(port, fn);
  }
}

function getCrawlerService() {
  if (!crawlerService) {
    crawlerService = new CrawlerService();
    crawlerService.app = express();
  }

  return crawlerService;
}

export { getCrawlerService };
