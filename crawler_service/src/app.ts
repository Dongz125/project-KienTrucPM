import express from "express";
import dotenv from "dotenv";
import { createMongoDriver, MongoDriver } from "./config/db";

dotenv.config();

let crawlerService: CrawlerService;

class CrawlerService {
  app: express.Express;
  mongo: MongoDriver;

  async initMongoose() {
    this.mongo = await createMongoDriver();
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
