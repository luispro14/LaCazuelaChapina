import { useState } from "react";
import axios from "axios";
import "../styles/login.css";  // CSS adaptado

export default function Login() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("https://localhost:7142/api/auth/login", {
        email: email,
        password: password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);
      window.location.href = "/dashboard";

      const Id = response.data.id;
      localStorage.setItem("Id", Id);
      window.location.href = "/dashboard";

    } catch (err) {
      setError("Credenciales incorrectas o algo salió mal.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">La Cazuela Chapina</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-button">Entrar</button>
        </form>
      </div>
    </div>
  );
}
