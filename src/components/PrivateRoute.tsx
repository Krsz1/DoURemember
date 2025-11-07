import { Navigate } from "react-router-dom";
import type { JSX } from "react";

// ⚙️ Modo temporal: autenticación simulada (para desarrollo sin Firebase)
const useAuth = () => {
  return { user: { name: "Demo User" }, loading: false };
};

interface Props {
  children: JSX.Element;
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

  // 🔸 Durante desarrollo: siempre deja entrar (ya que Firebase no está activo)
  return user ? children : <Navigate to="/" replace />;
}

export default PrivateRoute;
