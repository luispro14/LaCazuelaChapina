import { useState } from "react";
import SideBar from "./SideBar";
import "../styles/DashboardPage.css";

export default function PrivateLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="layout-container">
      <button
        className="toggle-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Abrir menú"
      >
        ☰
      </button>
      <div className={`sidebar-container ${sidebarOpen ? "open" : "closed"}`}>
        <SideBar />
      </div>
      <div className={`main-content ${sidebarOpen ? "" : "full-width"}`}>
        {children}
      </div>
    </div>
  );
}