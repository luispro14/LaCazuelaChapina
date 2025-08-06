import React, { useEffect, useState } from "react";
import PrivateLayout from "../components/PrivateLayout";
import "../styles/CombosPage.css";

export default function CombosPage() {
  const [combos, setCombos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [nuevoCombo, setNuevoCombo] = useState({
    name: "",
    description: "",
    price: 0,
    isSeasonal: false
  });
  const [asignar, setAsignar] = useState({
    comboId: "",
    productId: "",
    quantity: 1
  });
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Cargar combos y productos
  const cargarCombos = () => {
    fetch("https://localhost:7142/api/Combo")
      .then(res => res.json())
      .then(setCombos)
      .catch(() => setCombos([]));
  };
  const cargarProductos = () => {
    fetch("https://localhost:7142/api/Product")
      .then(res => res.json())
      .then(setProductos)
      .catch(() => setProductos([]));
  };

  useEffect(() => {
    cargarCombos();
    cargarProductos();
  }, [mensaje]);

  // Crear combo
  const handleCrearCombo = async (e) => {
    e.preventDefault();
    setMensaje(""); setError("");
    try {
      const res = await fetch("https://localhost:7142/api/Combo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nuevoCombo.name,
          description: nuevoCombo.description,
          price: Number(nuevoCombo.price),
          isSeasonal: Boolean(nuevoCombo.isSeasonal)
        })
      });
      if (res.ok) {
        setMensaje("Combo creado correctamente.");
        setNuevoCombo({ name: "", description: "", price: 0, isSeasonal: false });
        cargarCombos();
      } else {
        setError("Error al crear combo.");
      }
    } catch {
      setError("Error de conexión.");
    }
  };

  // Asignar producto a combo
  const handleAsignarProducto = async (e) => {
    e.preventDefault();
    setMensaje(""); setError("");
    try {
      const res = await fetch("https://localhost:7142/api/Combo/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comboId: Number(asignar.comboId),
          productId: Number(asignar.productId),
          quantity: Number(asignar.quantity)
        })
      });
      if (res.ok) {
        setMensaje("Producto asignado al combo correctamente.");
        setAsignar({ comboId: "", productId: "", quantity: 1 });
        cargarCombos();
      } else {
        setError("Error al asignar producto.");
      }
    } catch {
      setError("Error de conexión.");
    }
  };

  // Obtener nombre de producto por id
  const getNombreProducto = (id) => {
    const prod = productos.find(p => p.id === id);
    return prod ? prod.name : `ID ${id}`;
  };

  return (
    <PrivateLayout>
      <div className="combos-container">
        <h2>Combos</h2>
        <form className="combos-form" onSubmit={handleCrearCombo}>
          <input
            type="text"
            placeholder="Nombre del combo"
            value={nuevoCombo.name}
            onChange={e => setNuevoCombo({ ...nuevoCombo, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Descripción"
            value={nuevoCombo.description}
            onChange={e => setNuevoCombo({ ...nuevoCombo, description: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Precio"
            value={nuevoCombo.price}
            onChange={e => setNuevoCombo({ ...nuevoCombo, price: e.target.value })}
            required
          />
          <label>
            <input
              type="checkbox"
              checked={nuevoCombo.isSeasonal}
              onChange={e => setNuevoCombo({ ...nuevoCombo, isSeasonal: e.target.checked })}
            />
            ¿Es combo de temporada?
          </label>
          <button type="submit">Crear combo</button>
        </form>

        <h2>Asignar producto a combo</h2>
        <form className="combos-form" onSubmit={handleAsignarProducto}>
          <select
            value={asignar.comboId}
            onChange={e => setAsignar({ ...asignar, comboId: e.target.value })}
            required
          >
            <option value="">Selecciona combo</option>
            {combos.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={asignar.productId}
            onChange={e => setAsignar({ ...asignar, productId: e.target.value })}
            required
          >
            <option value="">Selecciona producto</option>
            {productos.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            placeholder="Cantidad"
            value={asignar.quantity}
            onChange={e => setAsignar({ ...asignar, quantity: e.target.value })}
            required
            style={{ width: "80px" }}
          />
          <button type="submit">Asignar producto</button>
        </form>

        {mensaje && <p className="combos-success">{mensaje}</p>}
        {error && <p className="combos-error">{error}</p>}

        <h2>Lista de combos</h2>
        <div className="combos-lista">
          {combos.length === 0 ? (
            <p>No hay combos registrados.</p>
          ) : (
            combos.map(combo => (
              <div key={combo.id} className="combos-card">
                <strong>{combo.name}</strong> - Q{combo.price}
                <div>{combo.description}</div>
                <div>
                  <span className="combos-tag">{combo.isSeasonal ? "De temporada" : "Regular"}</span>
                </div>
                <div>
                  <strong>Productos:</strong>
                  {combo.items && combo.items.length > 0 ? (
                    <ul>
                      {combo.items.map(item => (
                        <li key={item.id}>
                          {getNombreProducto(item.productId)} x{item.quantity}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>Sin productos asignados.</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PrivateLayout>
  );
}