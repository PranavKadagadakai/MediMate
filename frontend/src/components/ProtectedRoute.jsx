import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext.jsx";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return <div>Loading...</div>; // ⏳ Show loading while checking auth
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export default ProtectedRoute;
