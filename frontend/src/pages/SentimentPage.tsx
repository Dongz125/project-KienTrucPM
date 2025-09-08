import { useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";

interface SentimentData {
  _id: string;
  content: string;
  sentiment: { label: string; score: number }[];
  timestamp: number;
}

function SentimentLabel(props: { label: string; score: number }) {
  return (
    <ul>
      <li>
        Sentiment:{" "}
        {props.label == "positive" && (
          <span className="text-emerald-600">Positive</span>
        )}
        {props.label == "negative" && (
          <span className="text-rose-600">Negative</span>
        )}
        {props.label == "neutral" && (
          <span className="text-gray-600">Neutral</span>
        )}
      </li>
      <li>
        <span className="font-semibold">Score</span>: {props.score}
      </li>
    </ul>
  );
}

function SentimentCard(props: SentimentData) {
  return (
    <div className="px-4 py-2 rounded-md border border-gray-300 flex flex-col gap-2">
      <span className="font-bold text-lg">{props._id}</span>
      <p className="text-gray-700">{props.content}</p>
      {props.sentiment.map((val, idx) => (
        <SentimentLabel key={idx} {...val} />
      ))}
      <span className="text-gray-500 text-sm">
        {new Date(props.timestamp).toLocaleString()}
      </span>
    </div>
  );
}

export default function SentimentPage() {
  const [loading, setLoading] = useState(false);
  const [sentiment, setSentiment] = useState<SentimentData[]>([]);
  const [error, setError] = useState("");

  async function fetchSentimentData() {
    setError("");
    setLoading(true);
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/sentiment/results`,
    );
    const json = await res.json();

    if (res.status != 200) {
      setError(json.error);
      setLoading(false);
      return;
    }

    setSentiment(json);
    setLoading(false);
  }

  useEffect(() => {
    fetchSentimentData();
  }, []);

  return (
    <div className="flex flex-col gap-4 items-center w-full justify-center">
      <NavigationBar active="/sentiment" />

      <main className="flex flex-col gap-4 items-center w-full lg:w-2/3 xl:w-1/2">
        <button
          className="px-4 py-2 text-white rounded-md bg-blue-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          disabled={loading}
          onClick={fetchSentimentData}
        >
          {loading ? "Getting data..." : "Get Sentiment Data"}
        </button>
        {error && <span className="text-red-500">{error}</span>}

        <div className="flex flex-col gap-2 w-full">
          {sentiment.map((node) => (
            <SentimentCard key={node._id} {...node} />
          ))}
        </div>
      </main>
    </div>
  );
}
