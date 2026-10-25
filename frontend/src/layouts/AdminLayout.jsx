// layouts/AdminLayout.jsx
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/careers", label: "Career Management" },
  { to: "/admin/skills", label: "Skill Management" },
  { to: "/admin/resources", label: "Learning Resources" },
  { to: "/admin/students", label: "Student Management" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">Admin Panel</div>
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
          <div>Admin: {user?.name}</div>
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
