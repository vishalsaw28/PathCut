import type { UrlData } from "../types";
import { getRedirectBaseUrl } from "../services/api";

const truncateText = (text: string, maxLength: number) =>
  text.length <= maxLength ? text : text.substring(0, maxLength) + "...";

const URLTable: React.FC<{ urls: UrlData[] }> = ({ urls }) => {
  const redirectBaseUrl = getRedirectBaseUrl();

  if (urls.length === 0) return <p>No URLs have been shortened yet.</p>;

  return (
    <table className="url-table">
      <thead>
        <tr>
          <th>Short URL</th>
          <th>Original URL</th>
          <th>Clicks</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        {urls.map((url) => {
          const shortUrl = url.shortUrl || `${redirectBaseUrl}/${url.shortCode}`;
          return (
            <tr key={url._id}>
              <td>
                <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                  {shortUrl}
                </a>
              </td>
              <td>{truncateText(url.longUrl, 40)}</td>
              <td>
                <span className="stat-count">{url.clicks}</span> clicks
              </td>
              <td>
                {url.createdAt
                  ? new Date(url.createdAt).toLocaleDateString("en-IN")
                  : ""}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default URLTable;
