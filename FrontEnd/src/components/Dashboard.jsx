import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar pedidos y productos
  useEffect(() => {
    Promise.all([
      fetch("https://localhost:7142/api/Order").then((res) => res.json()),
      fetch("https://localhost:7142/api/Product").then((res) => res.json()),
    ])
      .then(([pedidosData, productosData]) => {
        setPedidos(Array.isArray(pedidosData) ? pedidosData : []);
        setProductos(Array.isArray(productosData) ? productosData : []);
        setLoading(false);
      })
      .catch(() => {
        setPedidos([]);
        setProductos([]);
        setLoading(false);
      });
  }, []);

  // Ventas diarias y mensuales
  const hoy = new Date();
  const pedidosHoy = pedidos.filter(
    (p) => new Date(p.createdAt).toDateString() === hoy.toDateString()
  );
  const pedidosMes = pedidos.filter(
    (p) =>
      new Date(p.createdAt).getMonth() === hoy.getMonth() &&
      new Date(p.createdAt).getFullYear() === hoy.getFullYear()
  );
  const ventasHoy = pedidosHoy.reduce((sum, p) => sum + (p.total || 0), 0);
  const ventasMes = pedidosMes.reduce((sum, p) => sum + (p.total || 0), 0);

  // Tamales más vendidos
  const tamales = {};
  pedidos.forEach((p) => {
    p.items.forEach((item) => {
      if (item.productName && item.productName.toLowerCase().includes("tamal")) {
        tamales[item.productName] = (tamales[item.productName] || 0) + item.quantity;
      }
    });
  });
  const tamalesMasVendidos = Object.entries(tamales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Bebidas preferidas por franja horaria (mañana, tarde, noche)
  const bebidasPorFranja = { Mañana: {}, Tarde: {}, Noche: {} };
  pedidos.forEach((p) => {
    const hora = new Date(p.createdAt).getHours();
    let franja = "Mañana";
    if (hora >= 12 && hora < 18) franja = "Tarde";
    else if (hora >= 18 || hora < 6) franja = "Noche";
    p.items.forEach((item) => {
      if (item.productName && item.productName.toLowerCase().includes("bebida")) {
        bebidasPorFranja[franja][item.productName] =
          (bebidasPorFranja[franja][item.productName] || 0) + item.quantity;
      }
    });
  });

  // Proporción de picante vs no picante (por selección de atributo)
  let picante = 0,
    noPicante = 0;
  pedidos.forEach((p) => {
    p.items.forEach((item) => {
      if (item.selections) {
        item.selections.forEach((sel) => {
          if (
            sel.productAttributeName &&
            sel.productAttributeName.toLowerCase().includes("picante")
          ) {
            if (
              sel.productAttributeValueName &&
              sel.productAttributeValueName.toLowerCase().includes("sí")
            ) {
              picante += item.quantity;
            } else {
              noPicante += item.quantity;
            }
          }
        });
      }
    });
  });
  const totalPicante = picante + noPicante;

  return (
    <div className="dashboard-container">
      <h1>Panel de Indicadores</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <div className="dashboard-cards-row">
            <div className="dashboard-card">
              <h2>Ventas Hoy</h2>
              <p>Q{ventasHoy}</p>
            </div>
            <div className="dashboard-card">
              <h2>Ventas Mes</h2>
              <p>Q{ventasMes}</p>
            </div>
            <div className="dashboard-card">
              <h2>Pedidos Hoy</h2>
              <p>{pedidosHoy.length}</p>
            </div>
            <div className="dashboard-card">
              <h2>Pedidos Mes</h2>
              <p>{pedidosMes.length}</p>
            </div>
          </div>

          <div className="dashboard-extra">
            <div className="dashboard-section">
              <h3>Tamales más vendidos</h3>
              {tamalesMasVendidos.length === 0 ? (
                <p>No hay ventas de tamales.</p>
              ) : (
                <ul>
                  {tamalesMasVendidos.map(([nombre, cantidad]) => (
                    <li key={nombre}>
                      <strong>{nombre}</strong>: {cantidad}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="dashboard-section">
              <h3>Bebidas preferidas por franja</h3>
              {["Mañana", "Tarde", "Noche"].map((franja) => (
                <div key={franja}>
                  <strong>{franja}:</strong>{" "}
                  {Object.keys(bebidasPorFranja[franja]).length === 0
                    ? "Sin datos"
                    : Object.entries(bebidasPorFranja[franja])
                        .sort((a, b) => b[1] - a[1])
                        .map(([nombre, cantidad]) => `${nombre} (${cantidad})`)
                        .join(", ")}
                </div>
              ))}
            </div>
            <div className="dashboard-section">
              <h3>Proporción Picante / No Picante</h3>
              {totalPicante === 0 ? (
                <p>Sin datos</p>
              ) : (
                <p>
                  Picante: {((picante / totalPicante) * 100).toFixed(1)}%<br />
                  No Picante: {((noPicante / totalPicante) * 100).toFixed(1)}%
                </p>
              )}
            </div>
            <div className="dashboard-section">
              <h3>Utilidades por línea</h3>
              <p>No disponible (requiere costos y ventas).</p>
            </div>
            <div className="dashboard-section">
              <h3>Desperdicio de materia prima</h3>
              <p>No disponible (requiere módulo de desperdicio).</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}