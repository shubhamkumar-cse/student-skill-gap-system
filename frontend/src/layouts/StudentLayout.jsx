// layouts/StudentLayout.jsx
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/student/dashboard", label: "Dashboard" },
  { to: "/student/profile", label: "Profile" },
  { to: "/student/skills", label: "My Skills" },
  { to: "/student/career", label: "Career Selection" },
  { to: "/student/skill-gap", label: "Skill Gap Analysis" },
  { to: "/student/roadmap", label: "Roadmap" },
  { to: "/student/progress", label: "Progress" },
];

export default function StudentLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">Skill Gap Analyzer</div>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
          >
            {link.label}
          </NavLink>
        ))}
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div>Welcome, {user?.name}</div>
          <button className="btn secondary" onClick={logout}>
            Logout
          </button>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
