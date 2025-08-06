import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa el hook
import "../styles/CuentasPage.css";
import PrivateLayout from "../components/PrivateLayout";

export default function CuentasPage() {
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Inicializa el hook

  const userId = localStorage.getItem("Id");

  useEffect(() => {
    async function fetchCuentas() {
      try {
        const res = await fetch(`https://localhost:7008/api/Cuenta/Cuenta/${userId}`);
        const data = await res.json();
        setCuentas(data);
      } catch (err) {
        setCuentas([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCuentas();
  }, [userId]);

  if (loading) return <p className="cuentas-loading">Cargando cuentas...</p>;

  return (
    <PrivateLayout>
      <div className="cuentas-container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2 className="cuentas-title">Mis cuentas</h2>
          <button
            onClick={() => navigate("/transferencias")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#8f03b1",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Nueva Transferencia
          </button>
        </div>
        {cuentas.length === 0 ? (
          <p className="cuentas-empty">No hay cuentas registradas.</p>
        ) : (
          <div className="cuentas-grid">
            {cuentas.map((cuenta) => (
              <div className="cuenta-card" key={cuenta.id}>
                <div className="cuenta-icon">💳</div>
                <div className="cuenta-nombre">{cuenta.nombre}</div>
                <div className="cuenta-disponible">
                  <span>Disponible:</span>
                  <strong>Q{cuenta.disponible}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PrivateLayout>
  );
}
