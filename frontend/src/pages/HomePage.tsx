import { useState } from "react";

function StatusCard(props: { name: string; status?: boolean }) {
  if (!props.status) {
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
  const [status, setStatus] = useState<{ service: string; healthy: boolean }[]>(
    [
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
    ],
  );

  function refetch() {
    console.log(import.meta.env.VITE_API_URL);
    fetch(`${import.meta.env.VITE_API_URL}/health`)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setStatus(json.services);
      })
      .catch((err) => {
        console.log(err);
        alert("An error happened while fetching");
      });
  }

  return (
    <div className="flex items-center justify-center w-full flex-col">
      <header className="py-2 px-4 text-center w-full text-3xl font-bold">
        PromptPal Status
      </header>

      <section className="p-6 flex flex-col items-center justify-center w-full lg:w-2/3 xl:w-1/2 gap-4">
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
              status={val.healthy}
              key={val.service}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
