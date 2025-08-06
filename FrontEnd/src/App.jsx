import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import DashboardPage from "./pages/DashboardPage";
import CuentasPage from "./pages/CuentasPage"; 
import TarjetasPage from "./pages/TarjetasPage"; 
import PrivateRoute from "./components/PrivateRoute";
import TransferenciaPage from "./components/TransferenciaPage"; // Importa el componente
import OrderPage from "./pages/OrderPage";
import PedidosPage from "./pages/PedidosPage";
import InventarioPage from "./pages/InventarioPage";
import NuevoProductoPage from "./pages/NuevoProductoPage";
import CombosPage from "./pages/CombosPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } />
        <Route path="/cuentas" element={
          <PrivateRoute>
            <CuentasPage />
          </PrivateRoute>
        } />
        <Route path="/tarjetas" element={
          <PrivateRoute>
            <TarjetasPage />
          </PrivateRoute>
        } />
        <Route path="/transferencias" element={
          <PrivateRoute>
            <TransferenciaPage />
          </PrivateRoute>
        } />
        <Route path="/ventas" element={
          <PrivateRoute>
            <OrderPage />
          </PrivateRoute>
        } />
        <Route path="/pedidos" element={
          <PrivateRoute>
            <PedidosPage />
          </PrivateRoute>
        } />
        <Route path="/inventario" element={
          <PrivateRoute>
            <InventarioPage />
          </PrivateRoute>
        } />
        <Route path="/productos/nuevo" element={
          <PrivateRoute>
            <NuevoProductoPage />
          </PrivateRoute>
        } />
        <Route path="/combos" element={
          <PrivateRoute>
            <CombosPage />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}


export default App;