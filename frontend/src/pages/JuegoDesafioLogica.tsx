// src/pages/JuegoDesafioLogica.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function JuegoDesafioLogica() {
  const navigate = useNavigate();

  const acertijos = [
    { pregunta: "Cuanto más quitas, más grande se hace. ¿Qué es?", respuesta: "agujero" },
    { pregunta: "Tiene agujas pero no pincha. ¿Qué es?", respuesta: "reloj" },
    { pregunta: "Corre pero no tiene piernas. ¿Qué es?", respuesta: "agua" },
    { pregunta: "Cuantos más hay, menos ves. ¿Qué es?", respuesta: "niebla" },
    { pregunta: "Tiene ojos pero no ve. ¿Qué es?", respuesta: "aguja" },
    { pregunta: "Vuelo sin alas, lloro sin ojos. ¿Qué soy?", respuesta: "nube" },
    { pregunta: "Siempre va hacia adelante, pero nunca regresa. ¿Qué es?", respuesta: "tiempo" },
    { pregunta: "Si me nombras, desaparezco. ¿Qué soy?", respuesta: "silencio" },
  ];

  const [indice, setIndice] = useState(0);
  const [respuestaUsuario, setRespuestaUsuario] = useState("");
  const [estado, setEstado] = useState<"idle" | "correct" | "wrong" | "completed">("idle");
  const [intentos, setIntentos] = useState(0);

  const total = acertijos.length;

  const verificarRespuesta = () => {
    if (estado === "completed") return;

    const correcta = acertijos[indice].respuesta.toLowerCase().trim();
    const entrada = respuestaUsuario.toLowerCase().trim();

    setIntentos((i) => i + 1);

    if (entrada === correcta) {
      // acierto
      if (indice === total - 1) {
        setEstado("completed");
      } else {
        setEstado("correct");
      }
    } else {
      // fallo
      setEstado("wrong");
    }
  };

  const siguiente = () => {
    if (indice < total - 1) {
      setIndice((i) => i + 1);
      setRespuestaUsuario("");
      setEstado("idle");
    } else {
      setEstado("completed");
    }
  };

  const reiniciar = () => {
    setIndice(0);
    setRespuestaUsuario("");
    setEstado("idle");
    setIntentos(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Barra superior */
      }
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <Header />
      </div>

      {/* Contenido principal (más espacio bajo la barra) */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
              <span className="text-2xl">🧩</span> Desafío de Lógica
            </h1>
            <p className="text-sm text-gray-500 mt-1">Resuelve acertijos cortos y ejercita la mente.</p>
          </div>

          {/* Botón volver (arriba, coherente con otras páginas) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-white border border-slate-200 px-3 py-2 rounded-lg text-slate-700 shadow-sm hover:shadow-md transition hover:bg-slate-50 text-sm"
            >
              ← Volver al Dashboard
            </button>
          </div>
        </div>

        {/* Tarjeta central del acertijo */}
        <section className="mx-auto w-full max-w-2xl">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            {/* Progreso */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-slate-600">
                Acertijo {Math.min(indice + 1, total)} de {total}
              </div>
              <div className="text-sm text-slate-500">Intentos: {intentos}</div>
            </div>

            {/* Pregunta */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 text-center">
                {acertijos[indice].pregunta}
              </h2>
            </div>

            {/* Input */}
            <div className="flex flex-col items-center gap-4">
              <input
                value={respuestaUsuario}
                onChange={(e) => setRespuestaUsuario(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") verificarRespuesta(); }}
                placeholder="Escribe tu respuesta aquí..."
                className={`w-full sm:w-3/4 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2
                  ${estado === "correct" ? "border-green-300 ring-green-200" : ""}
                  ${estado === "wrong" ? "border-red-300 ring-red-100" : ""}
                  ${estado === "completed" ? "opacity-80" : ""}`}
                aria-label="Respuesta del acertijo"
                disabled={estado === "completed"}
              />

              {/* Botones */}
              <div className="flex items-center gap-3">
                <button
                  onClick={verificarRespuesta}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  disabled={estado === "completed"}
                >
                  Verificar
                </button>

                {/* Mostrar Siguiente sólo si acertó */}
                {estado === "correct" && (
                  <button
                    onClick={siguiente}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Siguiente
                  </button>
                )}

                {/* Permitir reiniciar en cualquier momento */}
                <button
                  onClick={reiniciar}
                  className="bg-gray-100 text-slate-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition"
                >
                  Reiniciar
                </button>
              </div>
            </div>

            {/* Resultado */}
            <div className="mt-6 text-center min-h-[2.25rem]">
              {estado === "correct" && (
                <p className="text-green-600 font-semibold animate-pulse">✅ ¡Correcto! Pulsa 'Siguiente'.</p>
              )}
              {estado === "wrong" && (
                <p className="text-red-600 font-semibold">❌ No es correcto. Intenta otra vez.</p>
              )}
              {estado === "completed" && (
                <div>
                  <p className="text-2xl font-bold text-indigo-600 mb-3">🎉 ¡Has completado todos los acertijos!</p>
                  <p className="text-sm text-slate-600 mb-4">Buen trabajo — puedes reiniciar o volver al Dashboard.</p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={reiniciar}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      Jugar de nuevo
                    </button>
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="bg-white border border-slate-200 px-3 py-2 rounded-lg text-slate-700 hover:shadow-sm transition"
                    >
                      ← Volver al Dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
