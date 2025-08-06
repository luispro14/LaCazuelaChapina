import React, { useEffect, useState } from "react";
import PrivateLayout from "../components/PrivateLayout";
import "../styles/InventarioPage.css";

export default function InventarioPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showMovementForm, setShowMovementForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [form, setForm] = useState({
    name: "",
    category: "",
    unit: "",
    stockQuantity: 0,
    costPerUnit: 0,
    lastUpdated: new Date().toISOString()
  });
  const [movement, setMovement] = useState({
    inventoryItemId: "",
    quantity: 0,
    movementType: "Entrada",
    date: new Date().toISOString(),
    costTotal: 0,
    notes: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [movimientos, setMovimientos] = useState([]);
  const [movimientosProducto, setMovimientosProducto] = useState([]);
  const [showMovimientos, setShowMovimientos] = useState(false);
  const [movimientosLoading, setMovimientosLoading] = useState(false);

  // Cargar inventario
  useEffect(() => {
    fetch("https://localhost:7142/api/inventory/items")
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [message]);

  // Registrar nuevo producto
  const handleAddItem = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await fetch("https://localhost:7142/api/inventory/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: 0 })
      });
      if (res.ok) {
        setMessage("Producto registrado correctamente.");
        setShowAddForm(false);
        setForm({
          name: "",
          category: "",
          unit: "",
          stockQuantity: 0,
          costPerUnit: 0,
          lastUpdated: new Date().toISOString()
        });
      } else {
        setError("Error al registrar producto.");
      }
    } catch {
      setError("Error de conexión.");
    }
  };

  // Registrar movimiento (entrada/salida)
  const handleMovement = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const item = items.find(i => i.id === Number(movement.inventoryItemId));
      let cantidad = Number(movement.quantity);
      if (movement.movementType === "Salida" && cantidad > 0) {
        cantidad = -Math.abs(cantidad); // Convierte a negativo
      }
      const res = await fetch("https://localhost:7142/api/inventory/movements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inventoryItemId: item.id,
          quantity: cantidad,
          movementType: movement.movementType,
          date: movement.date,
          costTotal: Number(movement.costTotal),
          notes: movement.notes
        })
      });
      if (res.ok) {
        setMessage("Movimiento registrado correctamente.");
        setShowMovementForm(false);
        setMovement({
          inventoryItemId: "",
          quantity: 0,
          movementType: "Entrada",
          date: new Date().toISOString(),
          costTotal: 0,
          notes: ""
        });
      } else {
        setError("Error al registrar movimiento.");
      }
    } catch {
      setError("Error de conexión.");
    }
  };

  const handleVerMovimientos = async (productoId, productoNombre) => {
    setMovimientosLoading(true);
    setShowMovimientos(true);
    setMovimientosProducto([]);
    try {
      const res = await fetch("https://localhost:7142/api/inventory/movements");
      const data = await res.json();
      // Filtra solo los movimientos de este producto
      const filtrados = data.filter(mov => mov.inventoryItemId === productoId);
      setMovimientosProducto({ nombre: productoNombre, lista: filtrados });
    } catch {
      setMovimientosProducto({ nombre: productoNombre, lista: [] });
    }
    setMovimientosLoading(false);
  };

  const handleCerrarMovimientos = () => {
    setShowMovimientos(false);
    setMovimientosProducto([]);
  };

  return (
    <PrivateLayout>
      <div className="inventario-container">
        <h2 className="inventario-title">Inventario</h2>
        <div className="inventario-actions">
          <button className="inventario-btn" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? "Cancelar" : "Registrar Producto"}
          </button>
          <button className="inventario-btn" onClick={() => setShowMovementForm(!showMovementForm)}>
            {showMovementForm ? "Cancelar" : "Entrada/Salida"}
          </button>
        </div>

        {showAddForm && (
          <form className="inventario-form" onSubmit={handleAddItem}>
            <h3>Registrar nuevo producto</h3>
            <input
              type="text"
              placeholder="Nombre"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Categoría"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Unidad"
              value={form.unit}
              onChange={e => setForm({ ...form, unit: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Cantidad en stock"
              value={form.stockQuantity}
              onChange={e => setForm({ ...form, stockQuantity: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Costo por unidad"
              value={form.costPerUnit}
              onChange={e => setForm({ ...form, costPerUnit: e.target.value })}
              required
            />
            <button type="submit" className="inventario-btn">Registrar</button>
          </form>
        )}

        {showMovementForm && (
          <form className="inventario-form" onSubmit={handleMovement}>
            <h3>Registrar entrada/salida</h3>
            <select
              value={movement.inventoryItemId}
              onChange={e => setMovement({ ...movement, inventoryItemId: e.target.value })}
              required
            >
              <option value="">Selecciona producto</option>
              {items.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.category})
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Cantidad"
              value={movement.quantity}
              onChange={e => setMovement({ ...movement, quantity: e.target.value })}
              required
            />
            <select
              value={movement.movementType}
              onChange={e => setMovement({ ...movement, movementType: e.target.value })}
              required
            >
              <option value="Entrada">Entrada</option>
              <option value="Salida">Salida</option>
            </select>
            <input
              type="number"
              placeholder="Costo total"
              value={movement.costTotal}
              onChange={e => setMovement({ ...movement, costTotal: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Notas"
              value={movement.notes}
              onChange={e => setMovement({ ...movement, notes: e.target.value })}
            />
            <button type="submit" className="inventario-btn">Registrar movimiento</button>
          </form>
        )}

        {message && <p className="inventario-success">{message}</p>}
        {error && <p className="inventario-error">{error}</p>}

        <div className="inventario-list">
          <h3>Productos en inventario</h3>
          {loading ? (
            <p>Cargando...</p>
          ) : items.length === 0 ? (
            <p>No hay productos registrados.</p>
          ) : (
            <table className="inventario-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Unidad</th>
                  <th>Cantidad</th>
                  <th>Costo/U</th>
                  <th>Actualizado</th>
                  <th>Movimientos</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.unit}</td>
                    <td>{item.stockQuantity}</td>
                    <td>Q{item.costPerUnit}</td>
                    <td>{new Date(item.lastUpdated).toLocaleString()}</td>
                    <td>
                      <button
                        className="inventario-mov-btn"
                        onClick={() => handleVerMovimientos(item.id, item.name)}
                      >
                        Ver movimientos
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showMovimientos && (
          <div className="inventario-mov-modal">
            <div className="inventario-mov-content">
              <button className="inventario-mov-close" onClick={handleCerrarMovimientos}>Cerrar</button>
              <h3>Movimientos de: {movimientosProducto.nombre}</h3>
              {movimientosLoading ? (
                <p>Cargando movimientos...</p>
              ) : movimientosProducto.lista.length === 0 ? (
                <p>No hay movimientos para este producto.</p>
              ) : (
                <table className="inventario-mov-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Tipo</th>
                      <th>Cantidad</th>
                      <th>Costo Total</th>
                      <th>Notas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movimientosProducto.lista.map(mov => (
                      <tr key={mov.id}>
                        <td>{new Date(mov.date).toLocaleString()}</td>
                        <td>{mov.movementType}</td>
                        <td>{mov.quantity}</td>
                        <td>Q{mov.costTotal}</td>
                        <td>{mov.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </PrivateLayout>
  );
}