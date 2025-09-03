import express from "express";
import { crawlReddit } from "../dispatchers/reddit-dispatch";
import { crawlStocktwit } from "../dispatchers/stocktwit-dispatch";
import { getCrawlerService } from "../app";

async function getCrawl(req: express.Request, res: express.Response) {
  const [redditResults, stocktwitResults] = await Promise.all([
    crawlReddit(),
    crawlStocktwit(),
  ]);

  const app = getCrawlerService();
  app.sendMessage([...redditResults, ...stocktwitResults]);
  res.status(200).json({
    reddit: redditResults,
    stocktwit: stocktwitResults,
  });
}

export { getCrawl };
