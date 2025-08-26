import type { UrlData } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const truncateText = (text: string, maxLength: number) =>
  text.length <= maxLength ? text : text.substring(0, maxLength) + "...";

const URLTable: React.FC<{ urls: UrlData[] }> = ({ urls }) => {
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
        {urls.map((url) => (
          <tr key={url._id}>
            <td>
              <a
                href={`${API_BASE_URL}/${url.shortCode}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {`${API_BASE_URL}/${url.shortCode}`}
              </a>
            </td>
            <td>{truncateText(url.longUrl, 40)}</td>
            <td>
              <span className="stat-count">{url.clicks}</span> clicks
            </td>
            <td>{new Date(url.created).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default URLTable;
