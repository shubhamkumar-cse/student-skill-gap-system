import { useEffect, useState } from "react";
import { adminApi } from "../../services/api";
import Loading from "../../components/Loading";
import Message from "../../components/Message";

const cards = [
  { key: "totalAccounts", label: "Total Registered Accounts", icon: "◎", tone: "purple", note: "All accounts created" },
  { key: "totalStudents", label: "Total Students", icon: "♙", tone: "green", note: "Student accounts" },
  { key: "totalCareers", label: "Career Roles", icon: "⌘", tone: "blue", note: "Available career paths" },
  { key: "totalSkills", label: "Skills", icon: "✳", tone: "amber", note: "Skills in the library" },
  { key: "totalResources", label: "Learning Resources", icon: "↗", tone: "pink", note: "Resources available" },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setStats(await adminApi.getStats());
      } catch (err) {
        setError(err.message || "Unable to load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-heading">
        <div>
          <span className="dashboard-eyebrow">SKILLPATH ADMINISTRATION</span>
          <h1>Admin Dashboard</h1>
          <p>Here's an overview of your SkillPath platform.</p>
        </div>
        <span className="admin-status-pill"><i /> Platform overview</span>
      </div>
      <Message type="error" text={error} />
      <div className="admin-stats-grid">
        {cards.map((card) => (
          <article className="admin-stat-card" key={card.key}>
            <div className="admin-stat-top">
              <span className="admin-stat-label">{card.label}</span>
              <span className={`admin-stat-icon ${card.tone}`}>{card.icon}</span>
            </div>
            <div className="admin-stat-number">{stats?.[card.key] ?? "—"}</div>
            <div className="admin-stat-note">{card.note}</div>
          </article>
        ))}
      </div>
      <section className="admin-welcome-panel">
        <div className="admin-welcome-icon">✦</div>
        <div>
          <h2>Your platform at a glance</h2>
          <p>Total registered accounts includes all roles. Total students counts accounts whose role is STUDENT.</p>
        </div>
      </section>
    </div>
  );
}
