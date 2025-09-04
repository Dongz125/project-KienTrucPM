import { useEffect, useState } from "react";
import LoadingPage from "./pages/LoadingPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<"login" | "register" | "home">("login");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/hello`)
      .then((res) => {
        if (res.status === 200) {
          return res.text();
        }
        return Promise.reject("API error");
      })
      .then((txt) => {
        console.log(txt); // "hello world"
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <>
      {page === "login" && (
        <LoginPage
          onLoginSuccess={() => setPage("home")}
          onGoRegister={() => setPage("register")}
        />
      )}

      {page === "register" && (
        <RegisterPage
          onRegisterSuccess={() => setPage("home")}
          onGoLogin={() => setPage("login")}
        />
      )}

      {page === "home" && <HomePage />}
    </>
  );
}

export default App;
