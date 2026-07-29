import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, requireRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole && role !== requireRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
