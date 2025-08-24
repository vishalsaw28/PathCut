import type { UrlData } from "../types";
import URLTable from "./UrlTable";

interface AdminViewProps {
  urls: UrlData[];
}

const AdminView: React.FC<AdminViewProps> = ({ urls }) => (
  <section className="admin-panel">
    <h2>URL Management Dashboard</h2>
    <p>View and manage all shortened URLs</p>
    <URLTable urls={urls} />
  </section>
);

export default AdminView;
