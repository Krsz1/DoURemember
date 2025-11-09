import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

// ✅ Botón nativo con Tailwind y tipado
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

  const palabras = [
    { palabra: "Memoria", pista: "Capacidad de recordar" },
    { palabra: "Cerebro", pista: "Órgano del pensamiento" },
    { palabra: "Aprender", pista: "Adquirir conocimiento" },
    { palabra: "Atención", pista: "Concentrarse en algo" },
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
      setPuntaje(puntaje + 1);
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white shadow-lg rounded-3xl p-8 text-center">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-slate-800">
            Juego de Palabras 🧠
          </h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm transition"
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Escribe la palabra según la pista.
        </p>

        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <p className="text-blue-700 font-medium">
            Pista: {palabras[indice].pista}
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
          Puntaje: <span className="font-semibold text-blue-600">{puntaje}</span>
        </p>
      </div>
    </div>
  );
}
