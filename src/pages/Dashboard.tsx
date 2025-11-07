import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import QuickCard from "../components/QuickCard";
import StatsCard from "../components/StatsCard";
import { Briefcase, Clock, Heart, Image } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero / Greeting */}
        <section className="mb-8">
          <div className="rounded-2xl p-6 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-50 shadow-sm flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-800">Hola — Bienvenido a DoURemember</h2>
              <p className="mt-2 text-slate-600">Registra recuerdos, crea recordatorios y mantén las memorias vivas.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
              <button
                onClick={() => navigate("/memories")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                aria-label="Ir a Recuerdos"
              >
                Ver Recuerdos
              </button>
              <button
                onClick={() => navigate("/memories")}
                className="px-4 py-2 bg-white border rounded-lg shadow hover:bg-slate-50 transition"
                aria-label="Nuevo recuerdo"
              >
                Nuevo recuerdo
              </button>
            </div>
          </div>
        </section>

        {/* Grid: Quick actions + Stats */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <QuickCard
              title="Recuerdos"
              subtitle="Ver y gestionar recuerdos"
              color="bg-white"
              icon={<Image className="w-6 h-6 text-blue-500" />}
              onClick={() => navigate("/memories")}
            />
            <QuickCard
              title="Recordatorios"
              subtitle="Rutinas y alertas"
              color="bg-white"
              icon={<Clock className="w-6 h-6 text-amber-500" />}
              onClick={() => navigate("/notifications")}
            />
            <QuickCard
              title="Soporte / Ayuda"
              subtitle="Cómo usar la app"
              color="bg-white"
              icon={<Briefcase className="w-6 h-6 text-green-500" />}
              onClick={() => alert("Sección de ayuda (UI)")}
            />
            <QuickCard
              title="Favoritos"
              subtitle="Recuerdos destacados"
              color="bg-white"
              icon={<Heart className="w-6 h-6 text-pink-500" />}
              onClick={() => navigate("/memories")}
            />
          </div>

          <aside className="space-y-4">
            <StatsCard label="Recuerdos" value="12" hint="Guardados por ti" />
            <StatsCard label="Próx. recordatorio" value="Hoy • 17:00" hint="Toma una siesta" />
            <StatsCard label="Última copia" value="2 días" hint="Backup automático" />
          </aside>
        </section>

        {/* Section: Recent memories preview */}
        <section>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recuerdos recientes</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Ejemplos visuales; después los ligamos con datos */}
            {Array.from({ length: 6 }).map((_, i) => (
              <article
                key={i}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition"
                role="article"
                aria-label={`Recuerdo ${i + 1}`}
              >
                <div className="h-40 bg-gradient-to-tr from-blue-200 to-green-200 flex items-center justify-center">
                  <Image className="w-12 h-12 text-white/90" />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-slate-800">Título del recuerdo {i + 1}</h4>
                  <p className="text-sm text-slate-500 mt-2">Una breve descripción para contextualizar este recuerdo.</p>
                  <div className="mt-3 flex gap-2">
                    <button className="text-sm px-3 py-1 rounded bg-blue-50 text-blue-700">Ver</button>
                    <button className="text-sm px-3 py-1 rounded bg-white border">Editar</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
