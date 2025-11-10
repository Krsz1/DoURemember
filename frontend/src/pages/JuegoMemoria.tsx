import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function JuegoMemoria() {
  const navigate = useNavigate();

  // --- Estados principales ---
  const [images, setImages] = useState<{ src: string; label: string }[]>([]);
  const [cards, setCards] = useState<{ src: string; label: string }[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [busy, setBusy] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  // --- Estados del modo cognitivo ---
  const [isCognitiveMode, setIsCognitiveMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showQuestions, setShowQuestions] = useState(false);
  const [answers, setAnswers] = useState<
    { image: string; question: string; answer: string }[]
  >([]);
  const [scoreData, setScoreData] = useState<{
    aciertos: number;
    errores: number;
    omisiones: number;
    score: number;
  } | null>(null);

  // --- Cargar configuración previa ---
  useEffect(() => {
    const saved = localStorage.getItem("memoriaConfig");
    if (saved) {
      const parsed = JSON.parse(saved);
      setImages(parsed);
      if (parsed.length >= 2) setIsConfigured(true);
    }
  }, []);

  // --- Subir imágenes ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: { src: string; label: string }[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push({ src: reader.result as string, label: "" });
        if (newImages.length === files.length) {
          const updated = [...images, ...newImages];
          setImages(updated);
          localStorage.setItem("memoriaConfig", JSON.stringify(updated));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // --- Cambiar etiquetas ---
  const handleLabelChange = (index: number, value: string) => {
    const updated = [...images];
    updated[index].label = value;
    setImages(updated);
    localStorage.setItem("memoriaConfig", JSON.stringify(updated));
  };

  // --- Mezclar ---
  const shuffle = (arr: any[]) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // --- Iniciar juego clásico ---
  const startGame = () => {
    if (images.length < 2) {
      alert("Debes subir al menos dos imágenes para jugar.");
      return;
    }
    const shuffled = shuffle([...images, ...images]);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setBusy(false);
    setIsConfigured(true);
    setIsCognitiveMode(false);
  };

  // --- Lógica del clásico ---
  const handleFlip = (index: number) => {
    if (busy) return;
    if (flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setBusy(true);
      setMoves((m) => m + 1);

      const [a, b] = newFlipped;
      if (cards[a].src === cards[b].src) {
        setTimeout(() => {
          setMatched((prev) => [...prev, a, b]);
          setFlipped([]);
          setBusy(false);
        }, 600);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setBusy(false);
        }, 700);
      }
    }
  };

  const allMatched = cards.length > 0 && matched.length === cards.length;

  const resetGame = () => {
    setIsConfigured(false);
    setIsCognitiveMode(false);
    setScoreData(null);
    setAnswers([]);
  };

  // --- Iniciar modo cognitivo ---
  const startCognitiveMode = () => {
    if (images.length === 0) {
      alert("Debes tener al menos una imagen configurada.");
      return;
    }
    setIsCognitiveMode(true);
    setCurrentIndex(0);
    setShowQuestions(false);
    setScoreData(null);
    setAnswers([]);
    setTimeout(() => setShowQuestions(true), 3000);
  };

  const handleAnswer = (question: string, answer: string) => {
    const currentImage = images[currentIndex].src;
    setAnswers((prev) => {
      const existing = prev.find(
        (a) => a.image === currentImage && a.question === question
      );
      if (existing) {
        return prev.map((a) =>
          a.image === currentImage && a.question === question
            ? { ...a, answer }
            : a
        );
      }
      return [...prev, { image: currentImage, question, answer }];
    });
  };

  const nextImage = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex((i) => i + 1);
      setShowQuestions(false);
      setTimeout(() => setShowQuestions(true), 3000);
    } else {
      finishCognitiveGame();
    }
  };

  // --- Cálculo de resultados (HU 4.2 y HU 4.3) ---
  const finishCognitiveGame = () => {
    let aciertos = 0;
    let errores = 0;
    let omisiones = 0;

    images.forEach((img) => {
      const resp = answers.find((a) => a.image === img.src);
      if (!resp) {
        omisiones++;
      } else {
        const match = resp.answer
          .toLowerCase()
          .includes(img.label.toLowerCase());
        if (match) aciertos++;
        else errores++;
      }
    });

    let score = aciertos * 10 - errores * 5;
    if (score < 0) score = 0;
    if (score > 100) score = 100;

    const result = { aciertos, errores, omisiones, score };
    setScoreData(result);
    localStorage.setItem("evaluacionCognitiva", JSON.stringify(result));
    console.log("Resultado cognitivo:", result);
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-6 py-10">
        {/* Título */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">🧩 Juego de Memoria</h1>
            <p className="text-gray-600 mt-1">
              Sube tus propias imágenes, asígnales etiquetas y juega o realiza una evaluación cognitiva.
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-slate-700 shadow-sm hover:shadow-md transition hover:bg-slate-50"
          >
            ← Volver al Dashboard
          </button>
        </div>

        {/* CONFIGURACIÓN */}
        {!isConfigured && (
          <div className="bg-white shadow-md rounded-2xl p-6 mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              ⚙️ Configuración del juego
            </h2>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="mb-4"
            />

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className="bg-gray-100 rounded-xl p-2 flex flex-col items-center shadow-sm"
                  >
                    <img
                      src={img.src}
                      alt={`imagen ${i}`}
                      className="w-full h-28 object-cover rounded-lg mb-2"
                    />
                    <input
                      type="text"
                      value={img.label}
                      onChange={(e) => handleLabelChange(i, e.target.value)}
                      placeholder="Etiqueta o descripción"
                      className="border border-gray-300 rounded-lg text-sm px-2 py-1 w-full"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* BOTONES ABAJO */}
            <div className="flex flex-wrap gap-3 mt-6 justify-center">
              <button
                onClick={startGame}
                className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
              >
                Iniciar juego clásico
              </button>
              <button
                onClick={startCognitiveMode}
                className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition"
              >
                Preparar evaluación cognitiva
              </button>
            </div>
          </div>
        )}

        {/* --- MODO CLÁSICO --- */}
        {isConfigured && !isCognitiveMode && (
          <>
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <div className="text-gray-700">
                Movimientos: <span className="font-semibold">{moves}</span> —{" "}
                Parejas encontradas:{" "}
                <span className="font-semibold">{matched.length / 2}</span>
              </div>

              <button
                onClick={resetGame}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
              >
                Nueva configuración
              </button>
            </div>

            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))" }}
            >
              {cards.map((card, idx) => {
                const isFlipped = flipped.includes(idx) || matched.includes(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => handleFlip(idx)}
                    disabled={busy || matched.includes(idx)}
                    className={`relative aspect-square rounded-2xl shadow-md overflow-hidden transition-all duration-300 ${
                      isFlipped
                        ? "bg-white"
                        : "bg-gradient-to-br from-blue-500 to-indigo-500"
                    }`}
                  >
                    {!isFlipped ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white text-2xl select-none">🎴</div>
                      </div>
                    ) : (
                      <img
                        src={card.src}
                        alt={card.label}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {allMatched && (
              <div className="mt-8 text-center">
                <h2 className="text-2xl font-semibold text-green-600 mb-3">
                  🎉 ¡Completaste el juego!
                </h2>
                <button
                  onClick={resetGame}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
                >
                  Volver a configurar
                </button>
              </div>
            )}
          </>
        )}

        {/* --- MODO COGNITIVO --- */}
        {isCognitiveMode && (
          <div className="bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Evaluación Cognitiva
            </h2>

            <img
              src={images[currentIndex].src}
              alt="recuerdo"
              className="w-full h-64 object-cover rounded-xl mb-4"
            />

            {!showQuestions ? (
              <p className="text-gray-600 text-center">
                Observa la imagen durante unos segundos...
              </p>
            ) : (
              <div className="space-y-4">
                {["¿Quién aparece?", "¿Dónde estaban?", "¿Qué estaban celebrando?"].map(
                  (q) => (
                    <div key={q}>
                      <p className="font-medium text-gray-700 mb-2">{q}</p>
                      <input
                        type="text"
                        onChange={(e) => handleAnswer(q, e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-1 w-full"
                        placeholder="Tu respuesta..."
                      />
                    </div>
                  )
                )}
                <button
                  onClick={nextImage}
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
                >
                  {currentIndex < images.length - 1 ? "Siguiente" : "Finalizar"}
                </button>
              </div>
            )}

            {scoreData && (
              <div className="mt-6 text-center">
                <h3 className="text-2xl font-semibold text-green-600">
                  Puntaje final: {scoreData.score} / 100
                </h3>
                <p className="text-gray-700 mt-2">
                  ✅ Aciertos: {scoreData.aciertos} | ❌ Errores: {scoreData.errores} | ⚪ Omisiones: {scoreData.omisiones}
                </p>
                <button
                  onClick={resetGame}
                  className="mt-4 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
                >
                  Nueva evaluación
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
