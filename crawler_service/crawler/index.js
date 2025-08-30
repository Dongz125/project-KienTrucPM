import axios from "axios";
import * as cheerio from "cheerio";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME = "finance_app";
const COLLECTION = "raw_posts";

// Crawl forum tài chính
async function crawlForum() {
  const url = "https://example.com/forum/finance"; // forum thực tế bạn thay vào
  const res = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  const $ = cheerio.load(res.data);

  let posts = [];
  $(".post-item").each((i, el) => {
    const title = $(el).find(".news-article-header").text().trim();
    const body = $(el).find(".news-article").text().trim();
    const user = $(el).find(".news-columnist-row").text().trim();
    const date = $(el).find(".sep").text().trim();

    posts.push({
      id: `${Date.now()}-${i}`, // tạo id đơn giản, forum thật thì dùng id post
      source: "forum",
      title,
      body,
      user,
      created_at: new Date(date || Date.now())
    });
  });

  return posts;
}

async function crawlStockTwits() {
  const url = "https://api.stocktwits.com/api/2/streams/symbol/AAPL.json";
  const res = await axios.get(url);
  return res.data.messages.map(msg => ({
    id: msg.id,
    symbol: msg.symbols[0]?.symbol,
    user: msg.user.username,
    body: msg.body,
    created_at: new Date(msg.created_at),
  }));
}

async function saveToMongo(data) {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  const col = db.collection(COLLECTION);

  for (const doc of data) {
    await col.updateOne({ id: doc.id }, { $set: doc }, { upsert: true });
  }

  await client.close();
}

async function main() {
  console.log("🚀 Crawling forum...");
  const forumPosts = await crawlForum();
  await saveToMongo(forumPosts);
  console.log(`✅ Saved ${forumPosts.length} forum posts`);
}

main().catch(console.error);
