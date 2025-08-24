import type { UrlData } from "../types";

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
          <tr key={url.id}>
            <td>http://localhost:3000/{url.shortCode}</td>
            <td>{truncateText(url.longUrl, 40)}</td>
            <td>
              <span className="stat-count">{url.clicks}</span> clicks
            </td>
            <td>{url.created}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default URLTable;
