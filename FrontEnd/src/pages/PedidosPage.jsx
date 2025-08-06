import React, { useEffect, useState } from "react";
import PrivateLayout from "../components/PrivateLayout";
import "../styles/PedidosPage.css";

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://localhost:7142/api/Order")
      .then(res => res.json())
      .then(data => setPedidos(Array.isArray(data) ? data : []))
      .catch(() => setPedidos([]))
      .finally(() => setLoading(false));
  }, []);

  // Filtrado por cliente o número de pedido
  const pedidosFiltrados = pedidos.filter(p =>
    p.customerName.toLowerCase().includes(filtro.toLowerCase()) ||
    String(p.id).includes(filtro)
  );

  return (
    <PrivateLayout>
      <div className="pedidos-container">
        <h2 className="pedidos-title">Pedidos</h2>
        <input
          className="pedidos-buscar"
          type="text"
          placeholder="Buscar por cliente o número de pedido"
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
        />
        {loading ? (
          <p>Cargando...</p>
        ) : pedidosFiltrados.length === 0 ? (
          <p>No hay pedidos registrados.</p>
        ) : (
          <table className="pedidos-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.customerName}</td>
                  <td>{new Date(p.createdAt).toLocaleString()}</td>
                  <td>Q{p.total}</td>
                  <td>
                    <button
                      className="pedidos-detalle-btn"
                      onClick={() => setDetalle(p)}
                    >
                      Ver detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {detalle && (
          <div className="pedidos-detalle-modal">
            <div className="pedidos-detalle-content">
              <button className="pedidos-detalle-close" onClick={() => setDetalle(null)}>Cerrar</button>
              <h3>Pedido #{detalle.id}</h3>
              <p><strong>Cliente:</strong> {detalle.customerName}</p>
              <p><strong>Fecha:</strong> {new Date(detalle.createdAt).toLocaleString()}</p>
              <p><strong>Total:</strong> Q{detalle.total}</p>
              <h4>Productos:</h4>
              <ul>
                {detalle.items.map(item => (
                  <li key={item.id}>
                    <strong>{item.productName}</strong> x{item.quantity} - Q{item.unitPrice}
                    {item.selections && item.selections.length > 0 && (
                      <ul className="pedidos-detalle-attrs">
                        {item.selections.map((sel, idx) => (
                          <li key={idx}>
                            {sel.productAttributeName}: <strong>{sel.productAttributeValueName}</strong>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </PrivateLayout>
  );
}