import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/student/dashboard", label: "Overview", icon: "⌂", end: true },
  { to: "/student/profile", label: "My profile", icon: "◉" },
  { to: "/student/skills", label: "My skills", icon: "✳" },
  { to: "/student/career", label: "Career goals", icon: "◎" },
  { to: "/student/skill-gap", label: "Skill analysis", icon: "⌁" },
  { to: "/student/roadmap", label: "Learning roadmap", icon: "↗" },
  { to: "/student/progress", label: "My progress", icon: "▥" },
];

export default function StudentLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell skillpath-shell">
      <aside className="sidebar skillpath-sidebar">
        <NavLink to="/" className="sidebar-brand skillpath-brand">
          <span className="skillpath-brand-mark">S</span>
          <span className="skillpath-brand-copy">Skill<span>Path</span><small>STUDENT WORKSPACE</small></span>
        </NavLink>

        <div className="sidebar-section-label">WORKSPACE</div>
        <nav className="skillpath-nav" aria-label="Student navigation">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `sidebar-link skillpath-nav-link${isActive ? " active" : ""}`}
            >
              <span className="nav-item-icon" aria-hidden="true">{link.icon}</span>
              <span>{link.label}</span>
              {link.label === "Learning roadmap" && <span className="nav-item-arrow">↗</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-help-card">
          <span className="help-card-star">✦</span>
          <strong>Keep growing</strong>
          <p>Every skill you learn moves you forward.</p>
          <NavLink to="/student/roadmap">View my roadmap <span>→</span></NavLink>
        </div>

        <div className="sidebar-profile">
          <div className="sidebar-avatar">{(user?.name || "S").trim().charAt(0).toUpperCase()}</div>
          <div className="sidebar-user-copy"><strong>{user?.name || "Student"}</strong><span>Student account</span></div>
          <button className="sidebar-logout" onClick={logout} title="Log out" aria-label="Log out">↗</button>
        </div>
      </aside>

      <div className="main-area skillpath-main">
        <header className="topbar skillpath-topbar">
          <div className="topbar-context"><span className="topbar-context-dot" /> Your career journey <span className="topbar-divider">/</span> <span>Student workspace</span></div>
          <div className="topbar-user">
            <div className="topbar-user-copy"><strong>{user?.name || "Student"}</strong><span>Keep moving forward</span></div>
            <div className="topbar-avatar">{(user?.name || "S").trim().charAt(0).toUpperCase()}</div>
          </div>
        </header>
        <main className="content skillpath-content"><Outlet /></main>
        <footer className="skillpath-footer"><span>SkillPath</span><span>Learn with purpose. Grow with confidence.</span></footer>
      </div>
    </div>
  );
}
