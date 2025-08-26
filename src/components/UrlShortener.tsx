import { useState } from "react";
import { shortenUrl } from "../services/api";

const UrlShortener = () => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await shortenUrl(longUrl);
      setShortUrl(result.shortUrl);
    } catch (err) {
      console.error(err);
      alert("Failed to shorten URL");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          placeholder="Enter your URL"
          required
        />
        <button type="submit">Shorten</button>
      </form>

      {shortUrl && (
        <p>
          Short URL: <a href={shortUrl}>{shortUrl}</a>
        </p>
      )}
    </div>
  );
};

export default UrlShortener;
