import { useEffect, useState } from "react";
import type { UrlData } from "../types";
import URLTable from "./UrlTable";
import { getAllUrls } from "../services/api";

const AdminView: React.FC = () => {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllUrls();
        setUrls(data);
      } catch (err) {
        console.error("Failed to fetch URLs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading URLs...</p>;

  return (
    <section className="admin-panel">
      <h2>URL Management Dashboard</h2>
      <p>View and manage all shortened URLs</p>
      <URLTable urls={urls} />
    </section>
  );
};

export default AdminView;
