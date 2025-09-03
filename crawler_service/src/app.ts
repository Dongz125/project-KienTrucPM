import express from "express";
import dotenv from "dotenv";

dotenv.config();

let crawlerService: CrawlerService;

class CrawlerService {
  app: express.Express;

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
