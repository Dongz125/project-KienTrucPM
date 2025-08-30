import puppeteer from "puppeteer";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME = "finance_app";
const COLLECTION = "raw_posts";

async function crawlForumWithPuppeteer() {
  const browser = await puppeteer.launch({
    headless: "new", // chạy headless, bỏ nếu muốn thấy browser thật
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  // URL của forum/website
  const url = "https://example.com/forum/finance";
  await page.goto(url, { waitUntil: "networkidle2" });

  // Lấy HTML sau khi JS load
  const posts = await page.evaluate(() => {
    let data = [];
    const items = document.querySelectorAll(".post-item");
    items.forEach((el, i) => {
      const title = el.querySelector(".post-title")?.innerText.trim() || "";
      const body = el.querySelector(".post-content")?.innerText.trim() || "";
      const user = el.querySelector(".post-author")?.innerText.trim() || "";
      const date = el.querySelector(".post-date")?.innerText.trim() || "";

      data.push({
        id: `${Date.now()}-${i}`,
        source: "forum-puppeteer",
        title,
        body,
        user,
        created_at: date ? new Date(date) : new Date(),
      });
    });
    return data;
  });

  await browser.close();
  return posts;
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
  console.log("🚀 Crawling forum with Puppeteer...");
  const forumPosts = await crawlForumWithPuppeteer();
  await saveToMongo(forumPosts);
  console.log(`✅ Saved ${forumPosts.length} forum posts`);
}

main().catch(console.error);
