import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

interface Props {
  children: JSX.Element;
}

function PrivateRoute({ children }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg">
        Cargando...
      </div>
    );
  }

  return user ? children : <Navigate to="/" replace />;
}

export default PrivateRoute;
