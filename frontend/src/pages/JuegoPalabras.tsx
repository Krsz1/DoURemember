import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

// ✅ Botón genérico estilizado con Tailwind
const Button: React.FC<ButtonProps> = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium transition-colors ${className}`}
  >
    {children}
  </button>
);

export default function JuegoPalabras() {
  const navigate = useNavigate();

  // 🔤 Palabras con sus pistas
  const palabras = [
    { palabra: "Memoria", pista: "Capacidad de recordar" },
    { palabra: "Cerebro", pista: "Órgano del pensamiento" },
    { palabra: "Aprender", pista: "Adquirir conocimiento" },
    { palabra: "Atención", pista: "Concentrarse en algo" },
    { palabra: "Recuerdo", pista: "Algo que no se olvida" },
    { palabra: "Pensar", pista: "Actividad mental constante" },
    { palabra: "Enseñar", pista: "Transmitir conocimiento" },
    { palabra: "Razonar", pista: "Usar la lógica para entender" },
    { palabra: "Palabra", pista: "Unidad básica del lenguaje" },
    { palabra: "Lenguaje", pista: "Medio para comunicarnos" },
  ];

  const [indice, setIndice] = useState(0);
  const [respuesta, setRespuesta] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [puntaje, setPuntaje] = useState(0);

  const verificarRespuesta = () => {
    if (
      respuesta.trim().toLowerCase() ===
      palabras[indice].palabra.toLowerCase()
    ) {
      setPuntaje((p) => p + 1);
      setMensaje("✅ ¡Correcto!");
    } else {
      setMensaje(`❌ Era: ${palabras[indice].palabra}`);
    }

    setTimeout(() => {
      setMensaje("");
      setRespuesta("");
      setIndice((indice + 1) % palabras.length);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 🌿 Barra superior */}
      <Header />

      {/* 🌸 Contenido principal */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-16">
        {/* Encabezado y botón volver */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">🔤 Juego de Palabras</h1>
            <p className="text-gray-600 mt-1">
              Escribe la palabra correcta según la pista.
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-slate-700 shadow-sm hover:shadow-md transition hover:bg-slate-50"
          >
            ← Volver al Dashboard
          </button>
        </div>

        {/* Tarjeta del juego */}
        <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md mx-auto text-center">
          <p className="text-gray-600 mb-4">Pista:</p>
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-blue-700 font-medium text-lg">
              {palabras[indice].pista}
            </p>
          </div>

          <input
            type="text"
            value={respuesta}
            onChange={(e) => setRespuesta(e.target.value)}
            placeholder="Tu respuesta..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />

          <Button
            onClick={verificarRespuesta}
            className="bg-blue-600 text-white hover:bg-blue-700 w-full"
          >
            Verificar
          </Button>

          {mensaje && (
            <p
              className={`mt-4 font-medium ${
                mensaje.startsWith("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {mensaje}
            </p>
          )}

          <p className="text-gray-500 text-sm mt-6">
            Puntaje:{" "}
            <span className="font-semibold text-blue-600">{puntaje}</span>
          </p>
        </div>
      </main>
    </div>
  );
}
