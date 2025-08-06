
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Module1 from "./components/ModuloVenta";
import Module2 from "./components/ModuloProductos";
import Header from "./components/Header";

const App = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        <div className="main-container">
          <Sidebar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/module1" element={<Module1 />} />
              <Route path="/module2" element={<Module2 />} />
              {/* Aquí puedes agregar más rutas */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
