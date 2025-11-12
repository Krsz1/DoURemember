import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserData } from "../api/authservice";
import { User, BarChart2, FileText } from "lucide-react";
import jsPDF from "jspdf";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface UserProfile {
  uid: string;
  nombre: string;
  documento: string;
  correo: string;
  telefono: string;
  rol: "medico" | "paciente" | "cuidador";
  medicoTratante?: string;
  nombrePaciente?: string;
  documentoPaciente?: string;
  foto?: string;
}

interface Metric {
  name: string;
  memoria: number;
  coherencia: number;
  omision: number;
  comision: number;
}

export default function Profile() {
  const navigate = useNavigate();
  const { uid: paramUid } = useParams<{ uid: string }>();

  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [metrics] = useState<Metric[]>([
    { name: "Juego 1", memoria: 85, coherencia: 90, omision: 5, comision: 4 },
    { name: "Juego 2", memoria: 82, coherencia: 88, omision: 6, comision: 5 },
    { name: "Juego 3", memoria: 90, coherencia: 92, omision: 3, comision: 2 },
  ]);

  const lastMetric = metrics[metrics.length - 1];
  const previousMetric = metrics[metrics.length - 2] || lastMetric;

  const evaluateChange = (current: number, previous: number) => {
    if (current > previous) return "text-green-600";
    if (current < previous) return "text-red-500";
    return "text-gray-600";
  };

  const handleProfile = async (uid: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No hay sesión activa");

      const data = await getUserData(uid, token);

      setUserData({
        ...data,
        foto: data.foto || "https://via.placeholder.com/120?text=Foto+Usuario",
      });
    } catch (error: any) {
      console.error("Error al cargar perfil:", error.response?.data || error.message);
      alert("Error al cargar perfil: " + (error.response?.data?.message || error.message));
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const uid = paramUid || localStorage.getItem("uid");
    if (uid) handleProfile(uid);
    else navigate("/dashboard");
  }, [paramUid]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de métricas cognitivas", 20, 20);
    doc.text(`Usuario: ${userData?.nombre}`, 20, 30);
    metrics.forEach((m, i) => {
      doc.text(
        `${m.name}: Memoria ${m.memoria}, Coherencia ${m.coherencia}, Omisión ${m.omision}, Comisión ${m.comision}`,
        20,
        50 + i * 10
      );
    });
    doc.save(`reporte-${userData?.nombre}.pdf`);
  };

  const exportCSV = () => {
    const header = "Juego,Memoria,Coherencia,Omision,Comision\n";
    const rows = metrics.map(m => `${m.name},${m.memoria},${m.coherencia},${m.omision},${m.comision}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `reporte-${userData?.nombre}.csv`;
    link.click();
  };

  if (loading) return <p>Cargando perfil...</p>;
  if (!userData) return <p>No se encontró usuario</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center py-10 px-4">
      <div className="bg-white/90 backdrop-blur-xl shadow-[0_10px_40px_rgb(0,0,0,0.1)] rounded-3xl p-8 w-full max-w-4xl text-gray-800">
        {/* Encabezado */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={userData.foto}
            alt="Foto del usuario"
            className="w-32 h-32 rounded-full object-cover border-4 border-orange-400 shadow-lg mb-4"
          />
          <h1 className="text-2xl font-semibold text-gray-900">{userData.nombre.split(" ")[0]}</h1>
          <p className="text-gray-500 text-sm mt-1">Rol: {userData.rol}</p>
        </div>

        {/* Información del usuario */}
        <div className="space-y-4 border-t border-gray-200 pt-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-orange-500" /> Información del usuario
          </h2>
          <div className="text-sm space-y-1">
            <p><strong>Nombre completo:</strong> {userData.nombre}</p>
            <p><strong>Documento:</strong> {userData.documento}</p>
            <p><strong>Correo:</strong> {userData.correo}</p>
            <p><strong>Teléfono:</strong> {userData.telefono}</p>

            {/* Campos según el rol */}
            {userData.rol === "paciente" && (
              <p><strong>Médico tratante:</strong> {userData.medicoTratante || "No asignado"}</p>
            )}
            {userData.rol === "cuidador" && (
              <>
                <p><strong>Nombre del paciente:</strong> {userData.nombrePaciente || "No asignado"}</p>
                <p><strong>Documento del paciente:</strong> {userData.documentoPaciente || "No asignado"}</p>
              </>
            )}
          </div>
        </div>

        {/* 📊 Gráficos de métricas */}
        <div className="mt-10 border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <BarChart2 className="w-5 h-5 text-green-500" /> Resultados Cognitivos
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="memoria" stroke="#2563eb" name="Memoria" />
              <Line type="monotone" dataKey="coherencia" stroke="#16a34a" name="Coherencia" />
              <Line type="monotone" dataKey="omision" stroke="#f59e0b" name="Omisión" />
              <Line type="monotone" dataKey="comision" stroke="#dc2626" name="Comisión" />
            </LineChart>
          </ResponsiveContainer>

          {/* Indicadores de tendencia */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <p className={evaluateChange(lastMetric.memoria, previousMetric.memoria)}>
              Memoria: {lastMetric.memoria} ({lastMetric.memoria > previousMetric.memoria ? "↑" : "↓"})
            </p>
            <p className={evaluateChange(lastMetric.coherencia, previousMetric.coherencia)}>
              Coherencia: {lastMetric.coherencia} ({lastMetric.coherencia > previousMetric.coherencia ? "↑" : "↓"})
            </p>
            <p className={evaluateChange(previousMetric.omision, lastMetric.omision)}>
              Omisión: {lastMetric.omision} ({lastMetric.omision < previousMetric.omision ? "↑ mejora" : "↓"})
            </p>
            <p className={evaluateChange(previousMetric.comision, lastMetric.comision)}>
              Comisión: {lastMetric.comision} ({lastMetric.comision < previousMetric.comision ? "↑ mejora" : "↓"})
            </p>
          </div>

          {/* Exportaciones */}
          <div className="mt-6 flex gap-4 justify-center">
            <button
              onClick={exportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md transition"
            >
              <FileText className="w-5 h-5" /> Exportar PDF
            </button>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md transition"
            >
              <FileText className="w-5 h-5" /> Exportar CSV
            </button>
          </div>
        </div>

        {/* Botón volver */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-10 text-sm text-blue-600 hover:underline"
        >
          ← Volver al Dashboard
        </button>
      </div>
    </div>
  );
}
