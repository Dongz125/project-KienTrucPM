import { useEffect, useState } from "react";
import LoadingPage from "./pages/LoadingPage";
import HomePage from "./pages/HomePage";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/hello`)
      .then((res) => {
        if (res.status == 200) {
          return res.text();
        }
        return new Promise(() => "");
      })
      .then((txt) => {
        // Should print hello world to console
        console.log(txt);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      {loading && <LoadingPage />}
      {!loading && <HomePage />}
    </>
  );
}

export default App;
