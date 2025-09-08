import { useCallback, useEffect, useRef, useState } from "react";
import AuthHeader from "../components/AuthHeader";
import NavigationBar from "../components/NavigationBar";

function StatusCard(props: {
  name: string;
  status: "loading" | "healthy" | "unhealthy";
}) {
  if (props.status == "loading") {
    return (
      <div className="flex flex-row rounded-md justify-between items-center px-6 py-4 gap-4 bg-gray-200 border-2 border-gray-400">
        <span className="font-semibold">{props.name}</span>
        <span className="text-gray-700">Unknown</span>
      </div>
    );
  }

  if (props.status == "unhealthy") {
    return (
      <div className="flex flex-row rounded-md justify-between items-center px-6 py-4 gap-4 bg-red-200 border-2 border-red-400">
        <span className="font-semibold">{props.name}</span>
        <span className="text-red-700">Unhealthy</span>
      </div>
    );
  }

  return (
    <div className="flex flex-row rounded-md justify-between items-center px-6 py-4 gap-4 bg-green-200 border-2 border-green-400">
      <span className="font-semibold">{props.name}</span>
      <span className="text-green-700">Healthy</span>
    </div>
  );
}

export default function HomePage() {
  const defaultStatus = useRef([
    {
      service: "crawler_service",
      healthy: false,
    },
    {
      service: "authentication_service",
      healthy: false,
    },
    {
      service: "data_transformation_service",
      healthy: false,
    },
    {
      service: "sentiment_analysis_service",
      healthy: false,
    },
    {
      service: "backtesting_service",
      healthy: false,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ service: string; healthy: boolean }[]>(
    defaultStatus.current,
  );

  const refetch = useCallback(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/health`)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setStatus(json.services);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        alert("An error happened while fetching");
        setStatus(defaultStatus.current);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="flex items-center justify-center w-full flex-col">
      <NavigationBar active="/" />

      <AuthHeader />

      <section className="p-6 flex flex-col items-center justify-center w-full lg:w-2/3 xl:w-1/2 gap-4 py-12">
        <div className="flex flex-row items-center gap-2">
          <h2>Service Statuses</h2>
          <button className="size-6 cursor-pointer" onClick={refetch}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              className="fill-black size-6"
            >
              <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-2 w-full">
          {status.map((val) => (
            <StatusCard
              name={val.service}
              status={
                loading ? "loading" : val.healthy ? "healthy" : "unhealthy"
              }
              key={val.service}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
