// DashboardPage.jsx
import { useState } from "react";
import Sidebar from "../components/SideBar";
import Dashboard from "../components/Dashboard";
import "../styles/DashboardPage.css";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="layout-container">
      {/* ☰ botón de menú hamburguesa */}
      <button
        className="toggle-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Abrir menú"
      >
        ☰
      </button>

      {/* Sidebar */}
      <div className={`sidebar-container ${sidebarOpen ? "open" : "closed"}`}>
        <Sidebar />
      </div>

      {/* Contenido */}
      <div className={`main-content ${sidebarOpen ? "" : "full-width"}`}>
        <Dashboard />
      </div>
    </div>
  );
}