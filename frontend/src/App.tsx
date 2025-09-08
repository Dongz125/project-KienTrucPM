import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TradingPage from "./pages/TradingPage";
import CrawlerPage from "./pages/CrawlerPage";
import SentimentPage from "./pages/SentimentPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/trades" element={<TradingPage />} />
        <Route path="/crawl" element={<CrawlerPage />} />
        <Route path="/sentiment" element={<SentimentPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
