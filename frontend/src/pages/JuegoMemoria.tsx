import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { logoutUser, getUserData } from "../api/authservice";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import jsPDF from "jspdf";

type Img = { src: string; label: string };
type Answer = { image: string; question: string; answer: string };

type ScoreData = {
  aciertos: number;
  errores: number;
  omisiones: number;
  score: number; // 0-100
  memoriaPct: number; // % aciertos
  coherenciaPct: number; // % coherencia
  omissionPct: number; // % omisión
  commissionPct: number; // % comisión
};

export default function JuegoMemoria() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ nombre: string; email: string; rol: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // --- Estados principales ---
  const [images, setImages] = useState<Img[]>([]);
  const [cards, setCards] = useState<Img[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [busy, setBusy] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  // --- Estados del modo cognitivo ---
  const [isCognitiveMode, setIsCognitiveMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showQuestions, setShowQuestions] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);

  // --- Cargar configuración previa ---  const uid = localStorage.getItem("uid");


  useEffect(() => {
    const saved = localStorage.getItem("memoriaConfig");
    if (saved) {
      const parsed = JSON.parse(saved);
      setImages(parsed);
      if (parsed.length >= 2) setIsConfigured(true);
    }
  }, []);

  // Función para cerrar sesión
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

  // --- Subir imágenes ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: Img[] = [];
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
    setScoreData(null);
    setAnswers([]);
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
    setCards([]);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setBusy(false);
  };

  // --- Iniciar modo cognitivo (prepara y espera trigger del front) ---
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
    setTimeout(() => setShowQuestions(true), 3000); // mostrar preguntas tras 3s
  };

  const handleAnswer = (question: string, answer: string) => {
    const currentImage = images[currentIndex].src;
    setAnswers((prev) => {
      const existing = prev.find((a) => a.image === currentImage && a.question === question);
      if (existing) {
        return prev.map((a) => (a.image === currentImage && a.question === question ? { ...a, answer } : a));
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

  // ----- MÉTRICAS (propia lógica) -----
  const finishCognitiveGame = () => {
    const total = images.length;
    let aciertos = 0;
    let errores = 0;
    let omisiones = 0;

    // For coherencia, we implement a simple heuristic:
    // if answer contains majority of words from label or viceversa -> coherent
    const coherenceForPair = (label: string, text: string) => {
      const lab = label.toLowerCase().split(/\s+/).filter(Boolean);
      const ans = text.toLowerCase().split(/\s+/).filter(Boolean);
      if (ans.length === 0) return 0;
      const matches = lab.filter((w) => ans.includes(w)).length;
      return matches / Math.max(lab.length, 1);
    };

    const coherenceScores: number[] = [];

    images.forEach((img) => {
      // find any answer for this image (we use the "¿Quién aparece?" question as primary for "recuerda quién")
      const respWho = answers.find((a) => a.image === img.src && a.question === "¿Quién aparece?");
      if (!respWho || !respWho.answer.trim()) {
        omisiones++;
        coherenceScores.push(0);
      } else {
        const ans = respWho.answer.trim();
        const match = ans.toLowerCase().includes(img.label.toLowerCase());
        if (match) aciertos++;
        else errores++;
        coherenceScores.push(coherenceForPair(img.label, ans));
      }
    });

    // compute overall coherence as average of per-pair coherence scores (0..1)
    const avgCoherence = coherenceScores.length ? coherenceScores.reduce((s, v) => s + v, 0) / coherenceScores.length : 0;

    // Score algorithm: aciertos*10 - errores*5 (bounded 0..100)
    let score = aciertos * 10 - errores * 5;
    if (score < 0) score = 0;
    if (score > 100) score = 100;

    // Derived percentages
    const memoriaPct = (aciertos / total) * 100;
    const coherenciaPct = avgCoherence * 100;
    const omissionPct = (omisiones / total) * 100;
    const commissionPct = (errores / total) * 100;

    const data: ScoreData = {
      aciertos,
      errores,
      omisiones,
      score,
      memoriaPct: Math.round(memoriaPct),
      coherenciaPct: Math.round(coherenciaPct),
      omissionPct: Math.round(omissionPct),
      commissionPct: Math.round(commissionPct),
    };

    setScoreData(data);

    // Guardar resultado estandarizado en localStorage
    const resultadoRegistro = {
      juego: "Memoria - Recuerda Quién",
      fecha: new Date().toISOString(),
      aciertos: data.aciertos,
      errores: data.errores,
      omisiones: data.omisiones,
      score: data.score,
      memoriaPct: data.memoriaPct,
      coherenciaPct: data.coherenciaPct,
      omissionPct: data.omissionPct,
      commissionPct: data.commissionPct,
      detalles: answers,
    };

    const prev = JSON.parse(localStorage.getItem("resultados_cognitivos") || "[]");
    prev.push(resultadoRegistro);
    localStorage.setItem("resultados_cognitivos", JSON.stringify(prev));

    // Registrar acción en historial
    const historialPrev = JSON.parse(localStorage.getItem("historial_acciones") || "[]");
    historialPrev.push({
      fecha: new Date().toISOString(),
      accion: "Evaluación completada: Memoria - Recuerda Quién",
      fuente: "JuegoMemoria",
    });
    localStorage.setItem("historial_acciones", JSON.stringify(historialPrev));

    console.log("Resultado cognitivo guardado:", resultadoRegistro);
  };

  // --- GRÁFICO y export --- //
  // build chart data from scoreData and previous result (last saved for same game)
  const getChartDataAndColors = (): { data: { name: string; value: number }[]; colors: string[] } => {
    if (!scoreData) return { data: [], colors: [] };

    // get previous same-game result (if any)
    const allResults = JSON.parse(localStorage.getItem("resultados_cognitivos") || "[]");
    // find last before current (we just pushed current already inside finish; but to compare improvement we look at second last)
    let prevResult: any | null = null;
    if (allResults.length >= 2) {
      prevResult = allResults[allResults.length - 2]; // previous
    } else {
      prevResult = null;
    }

    const metrics = [
      { name: "Memoria", value: scoreData.memoriaPct, prev: prevResult ? prevResult.memoriaPct ?? null : null },
      { name: "Coherencia", value: scoreData.coherenciaPct, prev: prevResult ? prevResult.coherenciaPct ?? null : null },
      { name: "Omisión", value: scoreData.omissionPct, prev: prevResult ? prevResult.omissionPct ?? null : null },
      { name: "Comisión", value: scoreData.commissionPct, prev: prevResult ? prevResult.commissionPct ?? null : null },
    ];

    const data = metrics.map((m) => ({ name: m.name, value: Math.round(m.value) }));
    const colors = metrics.map((m) => {
      if (m.prev === null || m.prev === undefined) return "#16a34a"; // green as default when no previous
      // improvement means lower omission/commission and higher memory/coherence
      if (m.name === "Omisión" || m.name === "Comisión") {
        // lower is better: if current < prev => green else red
        return m.value <= m.prev ? "#16a34a" : "#dc2626";
      } else {
        // higher is better
        return m.value >= m.prev ? "#16a34a" : "#dc2626";
      }
    });

    return { data, colors };
  };

  const downloadCSV = () => {
    if (!scoreData) return;
    const header = ["juego", "fecha", "aciertos", "errores", "omisiones", "score", "memoriaPct", "coherenciaPct", "omissionPct", "commissionPct"];
    const row = [
      "Memoria - Recuerda Quién",
      new Date().toISOString(),
      String(scoreData.aciertos),
      String(scoreData.errores),
      String(scoreData.omisiones),
      String(scoreData.score),
      String(scoreData.memoriaPct),
      String(scoreData.coherenciaPct),
      String(scoreData.omissionPct),
      String(scoreData.commissionPct),
    ];

    // also include per-image answers as extra rows
    const csvRows = [header.join(","), row.join(",")];
    csvRows.push(""); // blank line
    csvRows.push("detalle_image,question,answer");
    answers.forEach((a) => {
      // sanitize fields (no commas)
      const line = [a.image.replace(/,/g, ""), a.question.replace(/,/g, ""), (a.answer || "").replace(/,/g, "")];
      csvRows.push(line.join(","));
    });

    const csv = csvRows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `memoria_result_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const downloadPDF = () => {
    if (!scoreData) return;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    doc.setFontSize(14);
    doc.text("Reporte - Evaluación Cognitiva: Memoria (Recuerda Quién)", 40, 50);
    doc.setFontSize(11);
    doc.text(`Fecha: ${new Date().toISOString()}`, 40, 70);

    doc.text(`Aciertos: ${scoreData.aciertos}`, 40, 100);
    doc.text(`Errores: ${scoreData.errores}`, 40, 120);
    doc.text(`Omisiones: ${scoreData.omisiones}`, 40, 140);
    doc.text(`Score: ${scoreData.score} / 100`, 40, 160);

    doc.text("Métricas (%):", 40, 190);
    doc.text(`Memoria: ${scoreData.memoriaPct}%`, 60, 210);
    doc.text(`Coherencia: ${scoreData.coherenciaPct}%`, 60, 230);
    doc.text(`Omisión: ${scoreData.omissionPct}%`, 60, 250);
    doc.text(`Comisión: ${scoreData.commissionPct}%`, 60, 270);

    doc.text("Respuestas (parcial):", 40, 300);
    let y = 320;
    answers.slice(0, 20).forEach((a) => {
      const line = `${a.question}: ${a.answer?.slice(0, 80) || ""}`;
      doc.text(line, 60, y);
      y += 16;
      if (y > 740) {
        doc.addPage();
        y = 40;
      }
    });

    doc.save(`memoria_report_${new Date().toISOString()}.pdf`);
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

  // chart computed values
  const { data: chartData, colors: chartColors } = getChartDataAndColors();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header user={user} logout={handleLogout} getUserData={handleGetUserData}/>
      <main className="flex-1 max-w-5xl mx-auto px-6 py-10">
        {/* Título */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">🧩 Juego de Memoria</h1>
            <p className="text-gray-600 mt-1">
              Sube tus propias imágenes, asígnales etiquetas y realiza la evaluación cognitiva (Recuerda Quién).
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
            <h2 className="text-xl font-semibold text-gray-800 mb-4">⚙️ Configuración del juego</h2>

            <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="mb-4" />

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                {images.map((img, i) => (
                  <div key={i} className="bg-gray-100 rounded-xl p-2 flex flex-col items-center shadow-sm">
                    <img src={img.src} alt={`imagen ${i}`} className="w-full h-28 object-cover rounded-lg mb-2" />
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
              <button onClick={startGame} className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition">
                Iniciar juego clásico
              </button>
              <button onClick={startCognitiveMode} className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition">
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
                Movimientos: <span className="font-semibold">{moves}</span> — Parejas encontradas:{" "}
                <span className="font-semibold">{matched.length / 2}</span>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={resetGame} className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
                  Nueva configuración
                </button>
              </div>
            </div>

            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))" }}>
              {cards.map((card, idx) => {
                const isFlipped = flipped.includes(idx) || matched.includes(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => handleFlip(idx)}
                    disabled={busy || matched.includes(idx)}
                    className={`relative aspect-square rounded-2xl shadow-md overflow-hidden transition-all duration-300 ${
                      isFlipped ? "bg-white" : "bg-gradient-to-br from-blue-500 to-indigo-500"
                    }`}
                  >
                    {!isFlipped ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white text-2xl select-none">🎴</div>
                      </div>
                    ) : (
                      <img src={card.src} alt={card.label} className="w-full h-full object-cover" />
                    )}
                  </button>
                );
              })}
            </div>

            {allMatched && (
              <div className="mt-8 text-center">
                <h2 className="text-2xl font-semibold text-green-600 mb-3">🎉 ¡Completaste el juego!</h2>
                <button onClick={resetGame} className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition">
                  Volver a configurar
                </button>
              </div>
            )}
          </>
        )}

        {/* --- MODO COGNITIVO --- */}
        {isCognitiveMode && (
          <div className="bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Evaluación Cognitiva — Recuerda Quién</h2>

            <img src={images[currentIndex].src} alt="recuerdo" className="w-full h-64 object-cover rounded-xl mb-4" />

            {!showQuestions ? (
              <p className="text-gray-600 text-center">Observa la imagen durante unos segundos...</p>
            ) : (
              <div className="space-y-4">
                {["¿Quién aparece?", "¿Dónde estaban?", "¿Qué estaban celebrando?"].map((q) => (
                  <div key={q}>
                    <p className="font-medium text-gray-700 mb-2">{q}</p>
                    <input
                      type="text"
                      onChange={(e) => handleAnswer(q, e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-1 w-full"
                      placeholder="Tu respuesta..."
                    />
                  </div>
                ))}

                <div className="flex gap-3 mt-2">
                  <button onClick={nextImage} className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition">
                    {currentIndex < images.length - 1 ? "Siguiente" : "Finalizar"}
                  </button>

                  <button
                    onClick={() => {
                      // quick manual finish if needed
                      finishCognitiveGame();
                    }}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-300 transition"
                  >
                    Finalizar ahora
                  </button>
                </div>
              </div>
            )}

            {/* Resultado: gráfico + export */}
            {scoreData && (
              <div className="mt-6">
                <div className="flex gap-3 items-center mb-4">
                  <h3 className="text-lg font-semibold">Resultados</h3>
                  <div className="ml-auto flex gap-2">
                    <button onClick={downloadCSV} className="bg-slate-700 text-white px-3 py-1 rounded-lg">Exportar CSV</button>
                    <button onClick={downloadPDF} className="bg-slate-700 text-white px-3 py-1 rounded-lg">Exportar PDF</button>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div style={{ height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="value">
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={chartColors[index] || "#16a34a"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Memoria</p>
                      <p className="text-2xl font-semibold">{scoreData.memoriaPct}%</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Coherencia</p>
                      <p className="text-2xl font-semibold">{scoreData.coherenciaPct}%</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Omisión</p>
                      <p className="text-2xl font-semibold">{scoreData.omissionPct}%</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Comisión</p>
                      <p className="text-2xl font-semibold">{scoreData.commissionPct}%</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mensaje si no hay score aún */}
            {!scoreData && (
              <p className="mt-4 text-sm text-gray-500">
                Al finalizar la evaluación (botón Finalizar) verás el gráfico con métricas y opciones de exportación.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

