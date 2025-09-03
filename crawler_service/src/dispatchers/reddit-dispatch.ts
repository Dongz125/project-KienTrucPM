import puppeteer, { Browser } from "puppeteer";

interface RedditPost {
  postId: string | null;
  author: string;
  source: string;
  content: string;
  postedAt: string;
  url: string;
}

export async function crawlReddit(
  subreddit: string = "wallstreetbets",
  limit: number = 20,
): Promise<RedditPost[]> {
  const browser: Browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // Pretend to be a real browser
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  );
  await page.setViewport({ width: 1280, height: 800 });

  const url = `https://www.reddit.com/r/${subreddit}/`;
  console.log("Reddit Crawler: Page is being loaded");
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  console.log("Reddit Crawler: Page is loaded");

  // Scroll down a bit to load lazy posts
  await page.evaluate(async () => {
    window.scrollBy(0, window.innerHeight * 2);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });

  const now = new Date();
  let posts: RedditPost[] = [];

  // Try new Reddit <shreddit-post>
  console.log("Reddit Crawler: Waiting for Shreddit Post");
  await page.waitForSelector("shreddit-post", { timeout: 8000 });
  console.log("Reddit Crawler: Shreddit Post found");

  posts = await page.evaluate(
    (max: number, crawledAt: string, source: string) => {
      const elements = document.querySelectorAll("shreddit-post");
      const data: RedditPost[] = [];

      for (let i = 0; i < elements.length && i < max; i++) {
        const el = elements[i];
        const ts = el.getAttribute("created-timestamp");
        const postUrl = el.getAttribute("permalink");
        data.push({
          source,
          author: el.getAttribute("author") || "unknown",
          content: el.getAttribute("post-title") || "unknown",
          postedAt: ts
            ? new Date(Number(ts) * 1000).toISOString()
            : new Date(crawledAt).toISOString(),
          postId: el.getAttribute("id") || "none",
          url: postUrl
            ? `https://www.reddit.com${postUrl}`
            : `https://www.reddit.com/r/${subreddit}`,
        });
      }

      return data;
    },
    limit,
    now.toISOString(),
    `reddit/r/${subreddit}`,
  );

  console.log("Reddit Crawler: Crawled", posts.length, "posts");

  await browser.close();
  return posts;
}
