import { LogOut, User } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

// Definimos la interface para las props
interface HeaderProps {
  user?: {
    email: string;
    nombre?: string;
  };
  logout: () => Promise<void>;
}

export default function Header({ user, logout }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (!logout) return; // evita error si logout no es función
    await logout();
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <header className="w-full bg-white/60 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo y nombre del proyecto */}
        <div className="flex items-center space-x-2">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
              DUR
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-800 leading-tight">DoURemember</h1>
              <p className="text-xs text-slate-500">Memorias y recordatorios</p>
            </div>
          </Link>
        </div>

        {/* Zona derecha: buscador + usuario */}
        <div className="flex items-center gap-3">

          {/* Usuario y logout */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-2 text-sm text-slate-700 hover:text-blue-600 transition"
              aria-label="Ir al perfil"
              title="Ver perfil"
            >
              <User className="w-4 h-4" />
              <span>{user?.email ?? "Usuario"}</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5 text-red-500" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
