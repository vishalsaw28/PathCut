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
    // Mock sample data
    const sampleData: UrlData[] = [
      {
        id: 1,
        shortCode: "abc123",
        longUrl: "https://example.com/page1",
        clicks: 12,
        created: "2023-06-15",
      },
      {
        id: 2,
        shortCode: "def456",
        longUrl: "https://example.com/page2",
        clicks: 7,
        created: "2023-07-22",
      },
      {
        id: 3,
        shortCode: "ghi789",
        longUrl: "https://example.com/blog",
        clicks: 23,
        created: "2023-08-05",
      },
    ];
    setUrls(sampleData);
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
