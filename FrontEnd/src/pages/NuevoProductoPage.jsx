import React, { useEffect, useState } from "react";
import PrivateLayout from "../components/PrivateLayout";
import "../styles/NuevoProductoPage.css";

export default function NuevoProductoPage() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState(0);
  const [atributos, setAtributos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Cargar productos existentes (para mostrar y para asociar atributos/opciones)
  useEffect(() => {
    fetch("https://localhost:7142/api/Product")
      .then(res => res.json())
      .then(setProductos)
      .catch(() => setProductos([]));
  }, [mensaje]);

  // Función para recargar productos
  const recargarProductos = () => {
    fetch("https://localhost:7142/api/Product")
      .then(res => res.json())
      .then(setProductos)
      .catch(() => setProductos([]));
  };

  // Crear producto
  const handleCrearProducto = async (e) => {
    e.preventDefault();
    setMensaje(""); setError("");
    try {
      const res = await fetch("https://localhost:7142/api/Product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nombre,
          price: Number(precio),
          productAttributes: []
        })
      });
      if (res.ok) {
        setMensaje("Producto creado correctamente.");
        setNombre(""); setPrecio(0);
      } else {
        setError("Error al crear producto.");
      }
    } catch {
      setError("Error de conexión.");
    }
  };

  // Crear ingrediente/atributo
  const handleCrearAtributo = async (e) => {
    e.preventDefault();
    setMensaje(""); setError("");
    const form = e.target;
    const productoId = form.producto.value;
    const nombreAtributo = form.nombreAtributo.value;
    try {
      const res = await fetch("https://localhost:7142/api/ProductAttribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: 0,
          name: nombreAtributo,
          productId: Number(productoId),
          options: []
        })
      });
      if (res.ok) {
        setMensaje("Ingrediente/atributo creado correctamente.");
        form.reset();
        recargarProductos();
      } else {
        setError("Error al crear ingrediente.");
      }
    } catch {
      setError("Error de conexión.");
    }
  };

  // Crear selección/opción de ingrediente
  const handleCrearOpcion = async (e) => {
    e.preventDefault();
    setMensaje(""); setError("");
    const form = e.target;
    const atributoId = form.atributo.value;
    const valor = form.valor.value;
    const productoId = form.productoOpcion.value;
    const producto = productos.find(p => p.id === Number(productoId));
    const atributo = producto?.productAttributes?.find(a => a.id === Number(atributoId));
    try {
      const res = await fetch("https://localhost:7142/api/ProductAttributeValue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: 0,
          value: valor,
          productAttributeId: Number(atributoId),
          productAttribute: atributo
        })
      });
      if (res.ok) {
        setMensaje("Selección de ingrediente creada correctamente.");
        form.reset();
        recargarProductos();
      } else {
        setError("Error al crear selección.");
      }
    } catch {
      setError("Error de conexión.");
    }
  };

  // Para el select de atributos según producto
  const [productoOpcion, setProductoOpcion] = useState("");
  const [atributosProducto, setAtributosProducto] = useState([]);
  //const atributosProducto = productos.find(p => p.id === Number(productoOpcion))?.productAttributes || [];

  useEffect(() => {
    if (!productoOpcion) {
      setAtributosProducto([]);
      return;
    }
    fetch(`https://localhost:7142/api/ProductAttribute?productId=${productoOpcion}`)
      .then(res => res.json())
      .then(data => setAtributosProducto(Array.isArray(data) ? data : []))
      .catch(() => setAtributosProducto([]));
  }, [productoOpcion, mensaje]);

  return (
    <PrivateLayout>
      <div className="nuevo-prod-container">
        <h2>Nuevo Producto</h2>
        <form className="nuevo-prod-form" onSubmit={handleCrearProducto}>
          <input
            type="text"
            placeholder="Nombre del producto"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Precio"
            value={precio}
            onChange={e => setPrecio(e.target.value)}
            required
          />
          <button type="submit">Crear producto</button>
        </form>

        <h2>Agregar Ingrediente/Atributo</h2>
        <form className="nuevo-prod-form" onSubmit={handleCrearAtributo}>
          <select name="producto" required>
            <option value="">Selecciona producto</option>
            {productos.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <input name="nombreAtributo" type="text" placeholder="Nombre del ingrediente/atributo" required />
          <button type="submit">Agregar ingrediente</button>
        </form>

        <h2>Agregar Selección/Opción de Ingrediente</h2>
        <form className="nuevo-prod-form" onSubmit={handleCrearOpcion}>
          <select
            name="productoOpcion"
            value={productoOpcion}
            onChange={e => setProductoOpcion(e.target.value)}
            required
          >
            <option value="">Selecciona producto</option>
            {productos.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <select name="atributo" required>
            <option value="">Selecciona ingrediente/atributo</option>
            {atributosProducto.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          <input name="valor" type="text" placeholder="Valor de la opción" required />
          <button type="submit">Agregar opción</button>
        </form>

        {mensaje && <p className="nuevo-prod-success">{mensaje}</p>}
        {error && <p className="nuevo-prod-error">{error}</p>}

        <h2>Productos existentes</h2>
        <div className="nuevo-prod-lista">
          {productos.length === 0 ? (
            <p>No hay productos registrados.</p>
          ) : (
            productos.map(p => (
              <div key={p.id} className="nuevo-prod-card">
                <strong>{p.name}</strong> - Q{p.price}
                {p.productAttributes && p.productAttributes.length > 0 && (
                  <ul>
                    {p.productAttributes.map(attr => (
                      <li key={attr.id}>
                        {attr.name}
                        {attr.options && attr.options.length > 0 && (
                          <ul>
                            {attr.options.map(opt => (
                              <li key={opt.id}>{opt.value}</li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </PrivateLayout>
  );
}