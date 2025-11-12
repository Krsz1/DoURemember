import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { logoutUser, getUserData } from "../api/authservice";

// Tipos base
interface Pair {
  id: number;
  image: string;
  label: string;
}

interface ResultadoCognitivo {
  juego: string;
  fecha: string;
  memoria: number;
  coherencia: number;
  omision: number;
  comision: number;
  puntaje: number;
}

// 📊 Función auxiliar para calcular métricas cognitivas
const calcularMetricas = (aciertos: number, errores: number, total: number) => {
  const memoria = aciertos / total;
  const omision = (total - aciertos) / total;
  const comision = errores / total;
  const coherencia = 1 - (comision + omision) / 2;
  return { memoria, coherencia, omision, comision };
};

// 📋 Guardar resultados locales
const guardarResultado = (resultado: ResultadoCognitivo) => {
  const prev = JSON.parse(localStorage.getItem("resultados_cognitivos") || "[]");
  localStorage.setItem("resultados_cognitivos", JSON.stringify([...prev, resultado]));
};

export default function JuegoEmparejar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ nombre: string; email: string; rol: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ Pares de imagen y etiqueta
  const initialPairs: Pair[] = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=400&q=80",
      label: "Gato",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=400&q=80",
      label: "Oso",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80",
      label: "Montaña",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
      label: "Mar",
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
      label: "Bosque",
    },
    {
      id: 6,
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80",
      label: "Desierto",
    },
  ];

  const [pairs, setPairs] = useState<Pair[]>([]);
  const [selected, setSelected] = useState<{ type: "image" | "label"; id: number } | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [difficulty, setDifficulty] = useState<"facil" | "dificil">("facil");
  const [showMessage, setShowMessage] = useState("");

  useEffect(() => {
    setPairs([...initialPairs].sort(() => Math.random() - 0.5));
  }, []);

  // 🎯 Selección de imágenes y etiquetas
  const handleSelect = (type: "image" | "label", id: number) => {
    if (matched.includes(id)) return;

    if (!selected) {
      setSelected({ type, id });
    } else {
      if (selected.type !== type) {
        if (selected.id === id) {
          setMatched((prev) => [...prev, id]);
          setScore((s) => s + 1);
          setShowMessage("✅ ¡Correcto!");
          setTimeout(() => setShowMessage(""), 1000);
        } else {
          setErrors((e) => e + 1);
          setShowMessage("❌ Intenta otra vez");
          setTimeout(() => setShowMessage(""), difficulty === "facil" ? 1500 : 800);
        }
        setSelected(null);
      }
    }
  };

  // 🔄 Reiniciar juego
  const resetGame = () => {
    setMatched([]);
    setScore(0);
    setErrors(0);
    setSelected(null);
    setShowMessage("");
    setPairs([...initialPairs].sort(() => Math.random() - 0.5));
  };

  const allMatched = matched.length === initialPairs.length;

  // 🧠 Cuando el jugador termina el juego
  useEffect(() => {
    if (allMatched) {
      const total = initialPairs.length;
      const { memoria, coherencia, omision, comision } = calcularMetricas(score, errors, total);

      const resultado: ResultadoCognitivo = {
        juego: "Emparejar Palabras",
        fecha: new Date().toISOString(),
        memoria,
        coherencia,
        omision,
        comision,
        puntaje: score,
      };

      guardarResultado(resultado);
    }
  }, [allMatched]);

  // Función para cerrar sesión
  const uid = localStorage.getItem("uid");

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
      <Header user={user} getUserData={handleGetUserData} logout={handleLogout}/>

      <main className="flex-1 max-w-6xl mx-auto px-6 py-10">
        {/* Encabezado */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">🧩 Juego de Emparejar</h1>
            <p className="text-gray-600 mt-1">
              Empareja cada imagen con su etiqueta correspondiente.
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-slate-700 shadow-sm hover:shadow-md transition hover:bg-slate-50"
          >
            ← Volver al Dashboard
          </button>
        </div>

        {/* Configuración */}
        <div className="mb-8 flex gap-4 items-center flex-wrap">
          <label className="font-medium text-gray-700">Dificultad:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as "facil" | "dificil")}
            className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500"
          >
            <option value="facil">Fácil (con pistas)</option>
            <option value="dificil">Difícil (sin pistas)</option>
          </select>

          <button
            onClick={resetGame}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Reiniciar
          </button>

          <p className="ml-auto text-gray-600">
            Puntaje: <span className="font-semibold text-blue-600">{score}</span>
          </p>
        </div>

        {/* Tablero */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Imágenes */}
          <div>
            <h2 className="text-center text-gray-700 font-semibold mb-3">Imágenes</h2>
            <div className="grid grid-cols-2 gap-3">
              {pairs.map((pair) => (
                <div
                  key={pair.id}
                  onClick={() => handleSelect("image", pair.id)}
                  draggable={!matched.includes(pair.id)}
                  onDragStart={(e) => e.dataTransfer.setData("pair-id", String(pair.id))}
                  className={`cursor-pointer rounded-xl overflow-hidden shadow-md border-4 transition-all duration-200 ${
                    selected?.type === "image" && selected.id === pair.id
                      ? "border-blue-400"
                      : matched.includes(pair.id)
                      ? "border-green-400"
                      : "border-transparent hover:border-blue-200"
                  }`}
                >
                  <img
                    src={pair.image}
                    alt={pair.label}
                    className="w-full h-28 object-cover"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/400x200?text=Imagen+no+disponible")
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Etiquetas */}
          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <h2 className="col-span-full text-center text-gray-700 font-semibold mb-3">
              Etiquetas
            </h2>
            {pairs.map((pair) => (
              <div
                key={pair.id}
                onClick={() => handleSelect("label", pair.id)}
                onDrop={(e) => {
                  const draggedId = Number(e.dataTransfer.getData("pair-id"));
                  handleSelect("label", draggedId);
                  handleSelect("image", pair.id);
                }}
                onDragOver={(e) => e.preventDefault()}
                className={`bg-white p-3 rounded-xl shadow-sm text-center cursor-pointer border-2 transition-all duration-200 ${
                  selected?.type === "label" && selected.id === pair.id
                    ? "border-blue-400"
                    : matched.includes(pair.id)
                    ? "border-green-400 bg-green-50"
                    : "border-gray-200 hover:border-blue-200"
                }`}
              >
                <span className="text-gray-700 font-medium">{pair.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mensaje */}
        {showMessage && (
          <p
            className={`mt-6 text-center text-lg font-semibold ${
              showMessage.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {showMessage}
          </p>
        )}

        {/* Final */}
        {allMatched && (
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-semibold text-green-600 mb-3">
              🎉 ¡Completaste todos los pares!
            </h2>
            <p className="text-gray-700 mb-4">
              Puntaje final: <span className="font-bold">{score}</span>
            </p>
            <p className="text-gray-600 mb-2">
              Resultados cognitivos guardados en el sistema.
            </p>
            <button
              onClick={resetGame}
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
            >
              Jugar de nuevo
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
