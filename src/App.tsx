import { useState } from "react";
import type { UrlData, ViewType } from "./types";
import "./index.css";
import Header from "./components/Header";
import HomeView from "./components/HomeView";
import AdminView from "./components/AdminView";
import Footer from "./components/Footer";

function App() {
  const [currentView, setCurrentView] = useState<ViewType>("home");
  const [urls, setUrls] = useState<UrlData[]>([]);

  const addUrl = (newUrl: UrlData) =>
    setUrls((prevUrls) => [...prevUrls, newUrl]);

  return (
    <div>
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="container">
        {currentView === "home" ? (
          <HomeView urls={urls} addUrl={addUrl} />
        ) : (
          <AdminView />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
