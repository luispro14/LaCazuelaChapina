// src/components/Sidebar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2></h2>
      </div>
      <ul className="sidebar-menu">
        <li>
          <Link to="/dashboard">
            <span className="sidebar-icon">🏠</span> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/ventas">
            <span className="sidebar-icon">🛒</span> Registrar Venta
          </Link>
        </li>
        <li>
          <Link to="/pedidos">
            <span className="sidebar-icon">📝</span> Pedidos
          </Link>
        </li>
        <li>
          <Link to="/inventario">
            <span className="sidebar-icon">📊</span> Inventario
          </Link>
        </li>
        <li>
          <Link to="/productos/nuevo">
            <span className="sidebar-icon">➕</span> Nuevo Producto
          </Link>
        </li>
        <li>
          <Link to="/combos">
            <span className="sidebar-icon">🥡</span> Combos
          </Link>
        </li>
        <li>
          <button onClick={handleLogout} className="logout-btn">
            <span className="sidebar-icon">🚪</span> Cerrar sesión
          </button>
        </li>
      </ul>
    </div>
  );
}
