import { getCrawlerService } from "./app";

const app = getCrawlerService();

// Initialize app.
async function start() {
  await app.initMongoose();
  app.start(process.env.PORT || 3003, () => {
    console.log("Server started on", process.env.PORT);
  });
}

start();
