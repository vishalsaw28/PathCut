import { useEffect, useState } from "react";
import type { ComponentType } from "react";
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
      try {
        const res = await fetch(
          "https://pathcut-5.onrender.com/api/admin/urls"
        );
        if (!res.ok) throw new Error("Failed to fetch URLs");
        const data = await res.json();
        setUrls(data);
      } catch (error) {
        console.error("Error fetching URLs:", error);
      }
    };
    fetchUrls();
  }, []);
  const addUrl = (newUrl: UrlData) =>
    setUrls((prevUrls) => [...prevUrls, newUrl]);

  const AdminViewComponent = AdminView as ComponentType<{ urls: UrlData[] }>;

  return (
    <div>
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="container">
        {currentView === "home" ? (
          <HomeView urls={urls} addUrl={addUrl} />
        ) : (
          <AdminViewComponent urls={urls} />
        )}
      </main>
      <Footer />
      <UrlShortener />
    </div>
  );
}

export default App;
