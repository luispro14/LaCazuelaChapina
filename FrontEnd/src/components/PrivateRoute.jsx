import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token"); // o usa contexto

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
