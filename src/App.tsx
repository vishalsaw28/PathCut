import { useEffect, useState } from "react";
import type { UrlData, ViewType } from "./types";
import "./index.css";
import Header from "./components/Header";
import HomeView from "./components/HomeView";
import AdminView from "./components/AdminView";
import Footer from "./components/Footer";
import UrlShortener from "./components/UrlShortener";

function App() {
  const [currentView, setCurrentView] = useState<ViewType>("home");
  const [urls, setUrls] = useState<UrlData[]>([]);
  useEffect(() => {
    const fetchUrls = async () => {
      const res = await fetch("/api/admin/urls");
      const data = await res.json();
      setUrls(data);
    };
    fetchUrls();
  }, []);

  const addUrl = (newUrl: UrlData) => setUrls([...urls, newUrl]);

  return (
    <div>
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="container">
        {currentView === "home" ? (
          <HomeView urls={urls} addUrl={addUrl} />
        ) : (
          <AdminView urls={urls} />
        )}
      </main>
      <Footer />
      <UrlShortener />
    </div>
  );
}

export default App;
