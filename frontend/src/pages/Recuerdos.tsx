import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { ArrowLeft, Plus, Trash } from "lucide-react";
import { logoutUser } from "../api/authservice";


type Recuerdo = {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  imagen?: string | null; // url local (preview) o null
};

const formatToday = () => new Date().toISOString().split("T")[0];

export default function Recuerdos() {
  const navigate = useNavigate();

  const [recuerdos, setRecuerdos] = useState<Recuerdo[]>([
    {
      id: 1,
      titulo: "Primer día en la universidad",
      descripcion: "Un recuerdo lleno de emoción y nervios.",
      fecha: "2019-02-03",
      imagen: null,
    },
    {
      id: 2,
      titulo: "Viaje familiar",
      descripcion: "La playa, el sol y muchas risas con mi familia.",
      fecha: "2022-06-15",
      imagen: null,
    },
  ]);

  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onSelectImage = (f: File | null) => {
    setImagenFile(f);
    if (!f) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const agregarRecuerdo = () => {
    if (!nuevoTitulo.trim()) return;

    const nuevo: Recuerdo = {
      id: Date.now(),
      titulo: nuevoTitulo.trim(),
      descripcion: nuevaDescripcion.trim() || "Sin descripción",
      fecha: formatToday(),
      imagen: preview || null,
    };

    setRecuerdos((prev) => [nuevo, ...prev]);
    // limpiar form
    setNuevoTitulo("");
    setNuevaDescripcion("");
    setImagenFile(null);
    setPreview(null);
  };

  const eliminarRecuerdo = (id: number) => {
    setRecuerdos((prev) => prev.filter((r) => r.id !== id));
  };

  // Función para cerrar sesión
  const uid = localStorage.getItem("uid");
  
  const handleLogout = async () => {
    if (!uid) return;
    await logoutUser(uid);
    localStorage.removeItem("uid");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <Header logout={handleLogout}/>
      </div>

      <main className="flex-1 max-w-6xl mx-auto px-6 py-10">
        {/* Top */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Tus Recuerdos 🕊️</h1>
            <p className="text-sm text-gray-500 mt-1">
              Guarda momentos importantes y recuérdalos cuando quieras.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-white border border-slate-200 px-3 py-2 rounded-lg text-slate-700 shadow-sm hover:shadow-md transition text-sm"
            >
              ← Volver al Dashboard
            </button>
          </div>
        </div>

        {/* Formulario para agregar recuerdo */}
        <section className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm text-slate-600 mb-2">Título</label>
              <input
                value={nuevoTitulo}
                onChange={(e) => setNuevoTitulo(e.target.value)}
                placeholder="Título del recuerdo..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm text-slate-600 mb-2">Descripción</label>
              <input
                value={nuevaDescripcion}
                onChange={(e) => setNuevaDescripcion(e.target.value)}
                placeholder="Descripción breve..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            <div className="w-full sm:w-56 flex flex-col gap-2">
              <label className="block text-sm text-slate-600">Imagen (opcional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files && e.target.files[0];
                  onSelectImage(f || null);
                }}
                className="text-sm"
              />
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-28 object-cover rounded-md border border-gray-100 shadow-sm"
                />
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={agregarRecuerdo}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 via-pink-500 to-red-400 text-white px-4 py-2 rounded-xl font-semibold shadow hover:shadow-lg transition"
            >
              <Plus className="w-4 h-4" /> Agregar recuerdo
            </button>

            <button
              onClick={() => {
                setNuevoTitulo("");
                setNuevaDescripcion("");
                setImagenFile(null);
                setPreview(null);
              }}
              className="px-4 py-2 rounded-xl bg-gray-100 text-slate-700 hover:bg-gray-200 transition"
            >
              Limpiar
            </button>
          </div>
        </section>

        {/* Lista de recuerdos */}
        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Recuerdos recientes</h2>

          {recuerdos.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl text-center border border-gray-100 shadow-sm">
              <p className="text-slate-600">Aún no hay recuerdos. Usa el formulario para agregar uno.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recuerdos.map((r) => (
                <article
                  key={r.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                >
                  {/* imagen si existe */}
                  {r.imagen ? (
                    <div className="h-40 bg-gray-100 overflow-hidden">
                      <img src={r.imagen} alt={r.titulo} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-40 bg-gradient-to-r from-blue-400 to-green-300 flex items-center justify-center text-white/90">
                      <svg className="w-10 h-10 opacity-90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7Z" fill="white" opacity="0.06"/>
                        <path d="M8 11L10.5 14L13 11L17 16H7L8 11Z" fill="white" opacity="0.9"/>
                      </svg>
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-800">{r.titulo}</h3>
                        <p className="text-sm text-slate-500 mt-1">{r.descripcion}</p>
                        <p className="text-xs text-slate-400 mt-3">📅 {r.fecha}</p>
                      </div>

                      <button
                        onClick={() => eliminarRecuerdo(r.id)}
                        title="Eliminar recuerdo"
                        className="ml-3 p-2 rounded-lg hover:bg-red-50 transition"
                      >
                        <Trash className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
