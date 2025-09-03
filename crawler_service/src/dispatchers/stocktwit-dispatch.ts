import puppeteer, { Browser } from "puppeteer";

interface StocktwitPost {
  source: string;
  author: string;
  content: string;
  postedAt: string;
  crawledAt: string;
  url?: string;
}

export async function crawlStocktwit(): Promise<StocktwitPost[]> {
  const browser: Browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  );

  await page.setViewport({ width: 1280, height: 800 });

  const url = `https://stocktwits.com/news-articles`;
  console.log("Stocktwit Crawler: Loading");
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  console.log("Stocktwit Crawler: Loaded content");

  // Scroll to trigger lazy load
  await page.evaluate(async () => {
    window.scrollBy(0, window.innerHeight * 2);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });

  console.log("Stocktwit Crawler: Loading message items");
  await page.waitForSelector("div[role='news feed']", { timeout: 10000 });
  console.log("Stocktwit Crawler: Loaded message items");

  const posts: StocktwitPost[] = await page.evaluate(() => {
    const lol = [...document.querySelectorAll("div")]
      .filter(
        (node) =>
          node.className && node.className.startsWith("NewsItem_textContainer"),
      )
      .map((node) => ({
        title: node.childNodes[1].childNodes[0].textContent,
        content: node.childNodes[2].textContent,
      }));

    const data: StocktwitPost[] = [];

    lol.forEach((node) =>
      data.push({
        source: "stocktwit",
        author: "stocktwit",
        content: `${node.title}: ${node.content}`,
        postedAt: new Date().toISOString(),
        crawledAt: new Date().toISOString(),
        url: "https://stocktwits.com/news-articles",
      }),
    );
    return data;
  });
  console.log("Stocktwit Crawler: Crawled", posts.length, "posts");

  await browser.close();
  return posts;
}
