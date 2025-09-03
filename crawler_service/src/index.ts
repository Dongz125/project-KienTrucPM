import { getCrawlerService } from "./app";
import { getCrawl } from "./controllers/crawl.controller";
import { getHealth } from "./controllers/health.controller";

const app = getCrawlerService();

// Initialize app.
async function start() {
  app.app.get("/health", getHealth);
  app.app.get("/crawl", getCrawl);

  app.start(process.env.PORT || 3003, () => {
    console.log("Server started on", process.env.PORT);
  });
}

start();
