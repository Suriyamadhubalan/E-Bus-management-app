import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ role, children }) => {
  const { user, role: userRole } = useAuth();

  // If authentication state is still loading, show nothing (or a spinner)
  if (!user || userRole === undefined) {
    return null; // Optional: Replace with a loading spinner
  }

  // If role is specified and does not match, redirect to home
  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
