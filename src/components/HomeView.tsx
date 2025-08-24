import { useState } from "react";
import type { UrlData } from "../types";
import CopyButton from "./CopyButton";

interface HomeViewProps {
  urls: UrlData[];
  addUrl: (url: UrlData) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ urls, addUrl }) => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const generateShortCode = (): string => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length: 6 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!longUrl) {
      setError("Please enter a URL");
      return;
    }
    try {
      new URL(longUrl);
    } catch {
      setError("Please enter a valid URL");
      return;
    }

    setError("");
    setSuccess("");

    const shortCode = generateShortCode();
    const newUrl: UrlData = {
      id: urls.length + 1,
      shortCode,
      longUrl,
      clicks: 0,
      created: new Date().toISOString().split("T")[0],
    };

    addUrl(newUrl);
    setShortUrl(`http://localhost:3000/${shortCode}`);
    setSuccess("URL shortened successfully!");
    setLongUrl("");
  };

  return (
    <section className="hero">
      <h2>Shorten Your Long URLs</h2>
      <p>
        PathCut is a free tool to shorten URLs. Create short, memorable links
        perfect for social media, messaging, and print.
      </p>

      <div className="url-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="long-url">Paste your long URL</label>
            <input
              type="url"
              id="long-url"
              className="form-input"
              placeholder="https://www.example.com/very-long-url"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">
            Shorten URL
          </button>
        </form>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        {shortUrl && (
          <div className="result">
            <h3>Your shortened URL</h3>
            <div className="short-url">
              <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                {shortUrl}
              </a>
              <CopyButton text={shortUrl} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeView;
