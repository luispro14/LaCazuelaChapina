import React, { useEffect, useState } from "react";
import PrivateLayout from "../components/PrivateLayout";
import "../styles/OrderPage.css";

export default function OrderPage() {
  const [products, setProducts] = useState([]);
  const [combos, setCombos] = useState([]);
  const [selectedComboId, setSelectedComboId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [comboQuantity, setComboQuantity] = useState(1);
  const [orderItems, setOrderItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Cargar productos
  useEffect(() => {
    fetch("https://localhost:7142/api/Product")
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  // Cargar combos
  useEffect(() => {
    fetch("https://localhost:7142/api/Combo")
      .then((res) => res.json())
      .then(setCombos)
      .catch(() => setCombos([]));
  }, []);

  // Cargar atributos del producto seleccionado
  useEffect(() => {
    if (!selectedProductId) {
      setAttributes([]);
      setSelectedAttributes({});
      return;
    }
    fetch(`https://localhost:7142/api/Product/${selectedProductId}/attributes`)
      .then((res) => res.json())
      .then((data) => {
        setAttributes(data.attributes || []);
        const initial = {};
        data.attributes.forEach(attr => {
          initial[attr.attributeId] = "";
        });
        setSelectedAttributes(initial);
      })
      .catch(() => setAttributes([]));
  }, [selectedProductId]);

  // Manejar selección de atributo
  const handleAttributeChange = (attributeId, value) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [attributeId]: value
    }));
  };

  // Agregar producto al pedido
  const handleAddProduct = () => {
    if (!selectedProductId || quantity < 1) return;
    const item = {
      productId: Number(selectedProductId),
      quantity: Number(quantity),
      selections: attributes
        .filter(attr => selectedAttributes[attr.attributeId])
        .map(attr => ({
          productAttributeId: attr.attributeId,
          productAttributeValueId: attr.options.indexOf(selectedAttributes[attr.attributeId]) + 1
        }))
    };
    setOrderItems([...orderItems, item]);
    setSelectedProductId("");
    setAttributes([]);
    setSelectedAttributes({});
    setQuantity(1);
  };

  // Agregar combo al pedido
  const handleAddCombo = () => {
    if (!selectedComboId || comboQuantity < 1) return;
    const combo = combos.find(c => c.id === Number(selectedComboId));
    if (!combo) return;
    // Cada combo se agrega como un producto especial (puedes ajustar la estructura si tu API lo requiere)
    setOrderItems([...orderItems, {
      comboId: combo.id,
      comboName: combo.name,
      quantity: Number(comboQuantity),
      price: combo.price
    }]);
    setSelectedComboId("");
    setComboQuantity(1);
  };

  // Registrar pedido
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!customerName || orderItems.length === 0) {
      setError("Agrega al menos un producto o combo y el nombre del cliente.");
      return;
    }
    setLoading(true);
    setError(null);
    setOrderSuccess(null);

    // Prepara items para la API (combos y productos)
    const items = orderItems.map(item => {
      if (item.comboId) {
        // Si es combo, agrega todos los productos del combo
        const combo = combos.find(c => c.id === item.comboId);
        return combo.items.map(ci => ({
          productId: ci.productId,
          quantity: ci.quantity * item.quantity,
          selections: []
        }));
      } else {
        return item;
      }
    }).flat();

    try {
      const res = await fetch("https://localhost:7142/api/Order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          items
        })
      });
      const data = await res.json();
      if (data.id) {
        setOrderSuccess(`Pedido registrado exitosamente. ID: ${data.id}`);
        setOrderItems([]);
        setCustomerName("");
      } else {
        setError("Error al registrar el pedido.");
      }
    } catch {
      setError("Error de conexión.");
    }
    setLoading(false);
  };

  return (
    <PrivateLayout>
      <div className="order-container">
        <h2 className="order-title">Registrar Venta</h2>
        <form className="order-form" onSubmit={handleSubmitOrder}>
          <div className="order-field">
            <label>Nombre del cliente:</label>
            <input
              type="text"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              required
              placeholder="Nombre"
            />
          </div>
          <div className="order-field">
            <label>Producto:</label>
            <select
              value={selectedProductId}
              onChange={e => setSelectedProductId(e.target.value)}
            >
              <option value="">Selecciona un producto</option>
              {products.map(prod => (
                <option key={prod.id} value={prod.id}>
                  {prod.name} - Q{prod.price}
                </option>
              ))}
            </select>
          </div>
          {attributes.length > 0 && (
            <div className="order-attributes">
              {attributes.map(attr => (
                <div key={attr.attributeId} className="order-field">
                  <label>{attr.attributeName}:</label>
                  {attr.options.length > 0 ? (
                    <select
                      value={selectedAttributes[attr.attributeId] || ""}
                      onChange={e => handleAttributeChange(attr.attributeId, e.target.value)}
                      required
                    >
                      <option value="">Selecciona una opción</option>
                      {attr.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="order-attr-empty">Sin opciones</span>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="order-field">
            <label>Cantidad:</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              style={{ width: "80px" }}
            />
          </div>
          <button
            type="button"
            className="order-add-btn"
            onClick={handleAddProduct}
            disabled={!selectedProductId}
          >
            Agregar producto
          </button>

          <hr style={{ margin: "2rem 0" }} />

          <div className="order-field">
            <label>Combo:</label>
            <select
              value={selectedComboId}
              onChange={e => setSelectedComboId(e.target.value)}
            >
              <option value="">Selecciona un combo</option>
              {combos.map(combo => (
                <option key={combo.id} value={combo.id}>
                  {combo.name} - Q{combo.price}
                </option>
              ))}
            </select>
          </div>
          <div className="order-field">
            <label>Cantidad:</label>
            <input
              type="number"
              min={1}
              value={comboQuantity}
              onChange={e => setComboQuantity(e.target.value)}
              style={{ width: "80px" }}
            />
          </div>
          <button
            type="button"
            className="order-add-btn"
            onClick={handleAddCombo}
            disabled={!selectedComboId}
          >
            Agregar combo
          </button>

          <div className="order-items-list">
            <h3>Productos y combos en el pedido:</h3>
            {orderItems.length === 0 ? (
              <p className="order-empty">No hay productos ni combos agregados.</p>
            ) : (
              <ul>
                {orderItems.map((item, idx) => (
                  <li key={idx}>
                    {item.comboId
                      ? `Combo: ${item.comboName} x${item.quantity} (Q${item.price})`
                      : `Producto #${item.productId} x${item.quantity}`}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="submit"
            className="order-submit-btn"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrar Pedido"}
          </button>
          {orderSuccess && <p className="order-success">{orderSuccess}</p>}
          {error && <p className="order-error">{error}</p>}
        </form>
      </div>
    </PrivateLayout>
  );
}