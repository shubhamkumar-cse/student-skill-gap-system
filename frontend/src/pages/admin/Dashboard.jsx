// pages/admin/Dashboard.jsx
import { useEffect, useState } from "react";
import { adminApi } from "../../services/api";
import Loading from "../../components/Loading";
import Message from "../../components/Message";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await adminApi.getStats();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <Message type="error" text={error} />
      <div className="card-grid">
        <div className="card stat-card">
          <div className="stat-label">Total Students</div>
          <div className="stat-value">{stats?.totalStudents ?? 0}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Career Roles</div>
          <div className="stat-value">{stats?.totalCareers ?? 0}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Skills</div>
          <div className="stat-value">{stats?.totalSkills ?? 0}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Learning Resources</div>
          <div className="stat-value">{stats?.totalResources ?? 0}</div>
        </div>
      </div>
    </div>
  );
}
