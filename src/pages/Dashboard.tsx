// src/pages/Dashboard.tsx
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import {
  Image,
  Clock,
  MessageSquare,
  Calendar,
  Activity,
  Settings,
  Smile,
  CheckCircle,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <Header />
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* HERO: barra azul→verde (solo esta barra es colorida) */}
        <section className="mb-8">
          <div className="rounded-2xl p-6 bg-gradient-to-r from-blue-400 to-green-300 text-white shadow-sm flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold">
                Hola 👋 — Bienvenido a{" "}
                <span className="font-extrabold">DoURemember</span>
              </h2>
              <p className="mt-2 opacity-95">
                Registra recuerdos, crea recordatorios y mantén las memorias vivas cada día 🌿
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
              <button
                onClick={() => navigate("/memories")}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg shadow hover:opacity-90 transition"
              >
                Nuevo Recuerdo
              </button>
              <button
                onClick={() => navigate("/notifications")}
                className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg shadow hover:opacity-90 transition"
              >
                Recordatorios
              </button>
            </div>
          </div>
        </section>

        {/* Menú principal (blanco) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MenuCard
              title="Recuerdos"
              subtitle="Ver y gestionar recuerdos"
              icon={<Image className="w-6 h-6 text-blue-500" />}
              onClick={() => navigate("/memories")}
            />
            <MenuCard
              title="Recordatorios"
              subtitle="Rutinas y alertas diarias"
              icon={<Clock className="w-6 h-6 text-green-500" />}
              onClick={() => navigate("/notifications")}
            />
            <MenuCard
              title="Mensajes del médico"
              subtitle="Notas y recomendaciones"
              icon={<MessageSquare className="w-6 h-6 text-cyan-500" />}
              onClick={() => alert("Mensajes del médico (en desarrollo)")}
            />
            <MenuCard
              title="Citas y rutinas"
              subtitle="Agenda médica o actividades"
              icon={<Calendar className="w-6 h-6 text-indigo-500" />}
              onClick={() => alert("Citas y rutinas (en desarrollo)")}
            />
            <MenuCard
              title="Estado del paciente"
              subtitle="Bienestar cognitivo y emocional"
              icon={<Activity className="w-6 h-6 text-teal-500" />}
              onClick={() => navigate("/status")}
            />
            <MenuCard
              title="Configuración"
              subtitle="Cuenta, perfil y ajustes"
              icon={<Settings className="w-6 h-6 text-slate-500" />}
              onClick={() => navigate("/settings")}
            />
          </div>

          {/* Sidebar (blanco) */}
          <aside className="space-y-4">
            <StatsCard label="Recuerdos" value="12" hint="Guardados por ti" />
            <StatsCard label="Próx. recordatorio" value="Hoy • 17:00" hint="Toma de medicación" />
            <StatsCard label="Último contacto médico" value="Hace 3 días" hint="Revisión de rutina" />
            <StatsCard label="Estado general" value="Estable ☀️" hint="Última actualización" />
          </aside>
        </section>

        {/* Tareas del día (AHORA blanco, sin gradiente) */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">Tareas del día 🗓️</h3>
          <div className="space-y-3">
            {[
              { text: "Tomar medicación de la mañana" },
              { text: "Ejercicio ligero (caminar 15 min)" },
              { text: "Registrar un recuerdo feliz" },
            ].map((task, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-white border border-slate-100 text-slate-700 shadow-sm"
              >
                {task.text}
              </div>
            ))}
          </div>
        </section>

        {/* Estado del día (AHORA en blanco, sin gradiente) */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Estado del día ☁️</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Smile className="text-green-500" size={22} />
                <h4 className="font-semibold text-slate-800">Estado emocional</h4>
              </div>
              <p className="text-slate-600 font-medium">Feliz y tranquilo 💚</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="text-blue-500" size={22} />
                <h4 className="font-semibold text-slate-800">Rutinas activas</h4>
              </div>
              <p className="text-slate-600 font-medium">4 pendientes hoy</p>
            </div>
          </div>

          <div className="mt-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm text-center">
            <p className="italic text-slate-700">
              “Cada recuerdo es una huella que el alma deja en el tiempo.”  
              <br />— <span className="font-medium text-slate-800">DoURemember</span> 🌱
            </p>
          </div>
        </section>

        {/* Recuerdos recientes */}
        <section>
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
                {/* FOTO: esta parte SI mantiene el gradiente azul→verde */}
                <div className="h-40 flex items-center justify-center bg-gradient-to-r from-blue-400 to-green-300">
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

// Subcomponentes
function MenuCard({ title, subtitle, icon, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl bg-white border border-slate-100 p-5 text-left shadow-sm hover:shadow-md transition"
    >
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <h4 className="font-semibold text-slate-800">{title}</h4>
      </div>
      <p className="text-sm text-slate-600">{subtitle}</p>
    </button>
  );
}

function StatsCard({ label, value, hint }: any) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
      <h4 className="text-sm text-slate-500">{label}</h4>
      <p className="text-xl font-semibold text-slate-800 mt-1">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{hint}</p>
    </div>
  );
}
