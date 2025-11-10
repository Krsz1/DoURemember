import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

interface Recordatorio {
  id: number;
  titulo: string;
  fecha: string;
  descripcion: string;
}

export default function Recordatorios() {
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);
  const [titulo, setTitulo] = useState("");
  const [fecha, setFecha] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const navigate = useNavigate();

  const agregarRecordatorio = () => {
    if (!titulo.trim() || !fecha.trim())
      return alert("Completa los campos obligatorios.");

    const nuevo: Recordatorio = {
      id: Date.now(),
      titulo,
      fecha,
      descripcion,
    };

    setRecordatorios([nuevo, ...recordatorios]);
    setTitulo("");
    setFecha("");
    setDescripcion("");
  };

  const eliminarRecordatorio = (id: number) => {
    setRecordatorios(recordatorios.filter((r) => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Barra superior */}
      <Header />

      {/* Contenido principal */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
        {/* Encabezado */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">⏰ Recordatorios</h1>
            <p className="text-gray-600 mt-1">
              Crea y gestiona tus recordatorios personales de forma sencilla.
            </p>
          </div>

          {/* 🔙 Botón de volver al Dashboard */}
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-slate-700 shadow-sm hover:shadow-md transition hover:bg-slate-50"
          >
            ← Volver al Dashboard
          </button>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow p-6 mb-10 border border-slate-100">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Nuevo recordatorio
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Título *</label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Cita médica"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Fecha *</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-700 mb-1">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Ej: Llevar resultados de exámenes..."
            />
          </div>

          <div className="mt-5 flex justify-end">
            <button
              onClick={agregarRecordatorio}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Agregar Recordatorio
            </button>
          </div>
        </div>

        {/* Lista de recordatorios */}
        <div>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Mis recordatorios
          </h2>

          {recordatorios.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              No tienes recordatorios aún. Crea uno arriba 👆
            </p>
          ) : (
            <div className="grid gap-4">
              {recordatorios.map((r) => (
                <div
                  key={r.id}
                  className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:shadow-md transition"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      {r.titulo}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {r.descripcion || "Sin descripción"}
                    </p>
                    <p className="text-blue-600 text-sm mt-2">
                      📅 {new Date(r.fecha).toLocaleDateString("es-CO")}
                    </p>
                  </div>

                  <button
                    onClick={() => eliminarRecordatorio(r.id)}
                    className="mt-4 sm:mt-0 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
