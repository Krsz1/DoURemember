import { Navigate } from "react-router-dom";
import React from "react"; // 👈 Importa React completo (para usar React.ReactNode)

const useAuth = () => {
  return { user: { name: "Demo User" }, loading: false };
};

interface Props {
  children: React.ReactNode; // 👈 Cambiado de JSX.Element → React.ReactNode
}

function PrivateRoute({ children }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg text-gray-700">
        Cargando...
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/" replace />; // 👈 Envuelto en fragmento
}

export default PrivateRoute;
