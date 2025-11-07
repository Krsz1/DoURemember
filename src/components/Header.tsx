import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="w-full bg-white/60 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
            DR
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-800 leading-tight">DoURemember</h1>
            <p className="text-xs text-slate-500">Memorias y recordatorios</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            aria-label="Buscar recuerdos"
            className="hidden sm:block w-64 px-3 py-2 border rounded-md text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Buscar recuerdos..."
          />
          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-700">{user?.email ?? "Usuario"}</div>
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
