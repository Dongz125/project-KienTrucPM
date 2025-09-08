import AuthHeader from "../components/AuthHeader";
import { useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";

function CrawledPost(props: { url: string; author: string; content: string }) {
  return (
    <div className="px-6 py-2 rounded-md border border-gray-300 shadow-md flex flex-col gap-2">
      <h2 className="text-xl font-semibold">{props.author}</h2>
      <p className="text-gray-700">{props.content}</p>
      <a href={props.url} className="text-blue-600">
        Link
      </a>
    </div>
  );
}

export default function CrawlerPage() {
  const [loading, setLoading] = useState(false);
  const [crawledData, setCrawledData] = useState<any[]>([]);

  async function crawl() {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/crawl/crawl`, {
        mode: "cors",
        method: "GET",
      });
      if (res.status == 200) {
        const json = await res.json();
        window.localStorage.setItem(
          "crawledData",
          JSON.stringify([...json.reddit, ...json.stocktwit]),
        );
        setCrawledData([...json.reddit, ...json.stocktwit]);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    const data = window.localStorage.getItem("crawledData");
    if (data) {
      setCrawledData(JSON.parse(data));
    }
  }, []);

  return (
    <div className="flex items-center justify-center w-full flex-col">
      <NavigationBar active="/crawl" />

      <AuthHeader />

      <section className="flex w-full items-center justify-center flex-col lg:w-2/3 xl:w-1/2">
        <button
          className="px-4 py-2 text-white rounded-md bg-blue-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          disabled={loading}
          onClick={crawl}
        >
          {loading ? "Crawling..." : "Crawl"}
        </button>

        <div className="flex flex-col">
          {crawledData.map((node) => (
            <CrawledPost {...node} key={node.content} />
          ))}
        </div>
      </section>
    </div>
  );
}
