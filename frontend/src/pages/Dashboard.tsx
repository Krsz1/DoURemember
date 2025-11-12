import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { logoutUser, getUserData } from "../api/authservice";
import {
  Clock,
  BookOpen,
  Gamepad2,
  Plus,
  Image,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ nombre: string; email: string; rol: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Función para cerrar sesión
  const handleLogout = async () => {
    const uid = localStorage.getItem("uid");
    const token = localStorage.getItem("token");

    if (!uid || !token) {
      console.warn("⚠️ No hay sesión activa");
      navigate("/login");
      return;
    }

    try {
      await logoutUser(uid, token); // ahora envía uid y token al backend
      localStorage.removeItem("uid");
      localStorage.removeItem("token");
      localStorage.removeItem("correo"); // si guardas el correo del usuario
      navigate("/login");
    } catch (error) {
      console.error("❌ Error cerrando sesión:", error);
    }
  };

  // Función para obtener datos del usuario desde el backend
const handleGetUserData = async () => {
  try {
    const uid = localStorage.getItem("uid");
    const token = localStorage.getItem("token");

    if (!uid || !token) throw new Error("No hay sesión activa");

    const userData = await getUserData(uid, token);

    localStorage.setItem("user", JSON.stringify({
      nombre: userData.nombre,
      email: userData.correo,
      rol: userData.rol
    }));

    // Navegar al perfil
    navigate("/profile", { state: { user: userData } });
  } catch (error) {
    console.error("❌ Error cargando perfil:", error);
  }
};


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 🌿 Header con barra de búsqueda y usuarios */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <Header user={user} logout={handleLogout} getUserData={handleGetUserData}/>
      </div>

      {/* 🌸 Contenido principal */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* 🌿 Encabezado de bienvenida */}
        <section>
          <div className="bg-gradient-to-r from-blue-400 to-green-400 text-white rounded-3xl p-5 shadow-md">
            <h1 className="text-2xl font-semibold">
              Hola 👋 — Bienvenido a <span className="font-bold">DoURemember</span>
            </h1>
            <p className="text-sm mt-2 opacity-90">
              Registra recuerdos, crea recordatorios y estimula tu mente cada día 🌿
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
            </div>
          </div>
        </section>

        {/* 🎯 Tus juegos */}
        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Tus juegos 🎯</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Juego 1 */}
            <div
              onClick={() => navigate("/juegos/memoria")}
              className="cursor-pointer bg-white shadow-md hover:shadow-lg transition-all rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-blue-50"
            >
              <Gamepad2 className="w-10 h-10 text-blue-500 mb-3" />
              <h3 className="font-semibold text-slate-700">Juego de Memoria</h3>
              <p className="text-sm text-gray-500 mt-1 text-center">Mejora tu memoria visual</p>
            </div>

            {/* Juego 2 */}
            <div
              onClick={() => navigate("/JuegoPalabras")}
              className="cursor-pointer bg-white shadow-md hover:shadow-lg transition-all rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-green-50"
            >
              <Gamepad2 className="w-10 h-10 text-green-500 mb-3" />
              <h3 className="font-semibold text-slate-700">Palabras y Letras</h3>
              <p className="text-sm text-gray-500 mt-1 text-center">Estimula tu vocabulario</p>
            </div>

            {/* Juego 3 */}
            <div
              onClick={() => navigate("/juegos/logica")}
              className="cursor-pointer bg-white shadow-md hover:shadow-lg transition-all rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-purple-50"
            >
              <Gamepad2 className="w-10 h-10 text-purple-500 mb-3" />
              <h3 className="font-semibold text-slate-700">Desafíos de Lógica</h3>
              <p className="text-sm text-gray-500 mt-1 text-center">Reta tu mente con acertijos</p>
            </div>
          </div>
        </section>

        {/* 💭 Tus memorias */}
        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Tus memorias 💭</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Recuerdos */}
            <div
              onClick={() => navigate("/recuerdos")}
              className="cursor-pointer bg-white shadow-md hover:shadow-lg transition-all rounded-2xl p-6 flex flex-col gap-2 hover:bg-yellow-50"
            >
              <BookOpen className="w-8 h-8 text-yellow-500" />
              <h3 className="font-semibold text-slate-800">Recuerdos</h3>
              <p className="text-sm text-gray-500">Ver y gestionar tus recuerdos personales</p>
            </div>

            {/* Recordatorios */}
            <div
              onClick={() => navigate("/recordatorios")}
              className="cursor-pointer bg-white shadow-md hover:shadow-lg transition-all rounded-2xl p-6 flex flex-col gap-2 hover:bg-blue-50"
            >
              <Clock className="w-8 h-8 text-blue-500" />
              <h3 className="font-semibold text-slate-800">Recordatorios</h3>
              <p className="text-sm text-gray-500">Configura tus rutinas y alertas diarias</p>
            </div>
          </div>
        </section>

        {/* 🌸 Recuerdos recientes */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Recuerdos recientes 🌸</h3>
            <button
              onClick={() => navigate("/memories")}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-800 rounded-lg shadow-sm hover:shadow-md transition"
            >
              + Nuevo
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-md transition"
              >
                <div className="h-40 flex items-center justify-center bg-gradient-to-r from-blue-400 to-green-300">
                  {/* Aquí podrás mostrar tus imágenes reales */}
                  <Image className="w-12 h-12 text-white/90" />
                </div>

                <div className="p-4">
                  <h4 className="font-semibold text-slate-800">Título del recuerdo {i + 1}</h4>
                  <p className="text-sm text-slate-500 mt-1">
                    Una breve descripción de este recuerdo significativo.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
