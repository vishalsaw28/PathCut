import { useState } from "react";
import type { UrlData } from "../types";
import CopyButton from "./CopyButton";
import { shortenUrl } from "../services/api";

interface HomeViewProps {
  urls: UrlData[];
  addUrl: (url: UrlData) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ urls, addUrl }) => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedUrl = longUrl.trim();
    if (!trimmedUrl) {
      setError("Please enter a URL");
      return;
    }

    const normalizedUrl = /^https?:\/\//i.test(trimmedUrl)
      ? trimmedUrl
      : `https://${trimmedUrl}`;

    try {
      new URL(normalizedUrl);
    } catch {
      setError("Please enter a valid URL");
      return;
    }

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const data = await shortenUrl(normalizedUrl);
      setShortUrl(data.shortUrl);
      setSuccess("URL shortened successfully!");
      setLongUrl("");
      addUrl({
        id: urls.length + 1,
        shortCode: data.shortCode,
        shortUrl: data.shortUrl,
        longUrl: data.longUrl,
        clicks: data.clicks ?? 0,
        created: new Date().toLocaleDateString("en-IN"),
        _id: data._id,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Server error. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
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
          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? "Shortening..." : "Shorten URL"}
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
