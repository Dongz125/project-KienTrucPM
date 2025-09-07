import { useEffect, useRef, useState } from "react";
import {
  CandlestickSeries,
  ColorType,
  createChart,
  type CandlestickData,
} from "lightweight-charts";

interface SymbolData {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  time: string;
}

export default function TradingPage() {
  const ws = useRef<WebSocket>(undefined);
  const [wsState, setWsState] = useState("closed");
  const [chartData, setChartData] = useState<{
    [symbol: string]: SymbolData[];
  }>({});
  const [token, setToken] = useState("");
  const chartRefs = useRef<{
    [symbol: string]: { chart: any; series: any };
  }>({});

  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:3000?user=guest`);

    ws.current.onopen = () => {
      console.log("websocket open");
      setWsState("open");
    };

    ws.current.onclose = () => {
      console.log("websocket close");
      setWsState("closed");
    };

    ws.current.onmessage = (e) => {
      const json = JSON.parse(e.data);
      console.log(json);
      if (!json || !json.symbol || !json.data) {
        return;
      }

      setChartData((chartData) => {
        const cur = chartData[json.symbol] || [];
        const newCandle = {
          open: parseFloat(json.data.open),
          close: parseFloat(json.data.close),
          high: parseFloat(json.data.high),
          low: parseFloat(json.data.low),
          volume: parseFloat(json.data.volume),
          time: json.data.timestamp,
        };

        if (cur.length > 1 && cur[cur.length - 1].time == newCandle.time) {
          cur[cur.length - 1] = newCandle;
        } else {
          cur.push(newCandle);
        }

        return { ...chartData, [json.symbol]: cur.slice(-100) };
      });
    };

    return () => {
      ws.current?.close();
      setWsState("closed");
    };
  }, []);

  useEffect(() => {
    Object.keys(chartData).forEach((symbol) => {
      const data = chartData[symbol];
      if (data && data.length > 0) {
        if (!chartRefs.current[symbol]) {
          const container = document.getElementById("container");
          if (container) {
            // Create a new chart instance and store it
            const chart = createChart(container, {
              height: 400,
              width: 1000,
              layout: {
                textColor: "black",
                background: {
                  type: ColorType.Solid,
                  color: "white",
                },
              },
            });
            const candlestickSeries = chart.addSeries(CandlestickSeries, {
              title: symbol,
              upColor: "#26a69a",
              downColor: "#ef5350",
              borderVisible: false,
              wickUpColor: "#26a69a",
              wickDownColor: "#ef5350",
            });
            chartRefs.current[symbol] = { chart, series: candlestickSeries };
            candlestickSeries.setData(data as CandlestickData[]);
            chart.timeScale().fitContent();
          }
        } else {
          // Update the existing chart
          chartRefs.current[symbol].series.setData(data);
          chartRefs.current[symbol].chart.timeScale().fitContent();
        }
      }
    });
  }, [chartData]);

  function submitToken() {
    if (!token) {
      alert("Token invalid");
      return;
    }

    if (!ws.current) {
      alert("Websocket is invalid");
      return;
    }

    ws.current?.send(JSON.stringify({ action: "subscribe", symbol: token }));
  }

  return (
    <div className="w-full p-6 flex flex-col items-center justify-center gap-4">
      {wsState}

      <section className="flex flex-col gap-4 items-center w-full lg:w-2/3 xl:w-1/2">
        <div className="flex flex-row gap-2 w-full">
          <input
            type="text"
            className="px-4 py-2 rounded-md border-2 border-black w-full"
            value={token}
            placeholder="btcusdt"
            onChange={(e) => setToken(e.target.value)}
          />

          <button
            onClick={submitToken}
            className="min-w-fit px-4 py-2 bg-black text-white cursor-pointer rounded-md border-2 border-black"
          >
            Add Token
          </button>
        </div>

        <div className="min-w-fit min-h-fit" id="container"></div>
      </section>
    </div>
  );
}
