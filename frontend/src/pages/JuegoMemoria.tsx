import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { logoutUser } from "../api/authservice";

const ICONS = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];

export default function JuegoMemoria() {
  const navigate = useNavigate();

  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [busy, setBusy] = useState(false);
  const uid = localStorage.getItem("uid");


  useEffect(() => {
    resetGame();
  }, []);

  // Función para cerrar sesión
  const handleLogout = async () => {
    if (!uid) return;
    await logoutUser(uid);
    localStorage.removeItem("uid");
    navigate("/");
  };

  const shuffle = (arr: string[]) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const resetGame = () => {
    const deck = shuffle([...ICONS, ...ICONS]);
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setBusy(false);
  };

  const handleFlip = (index: number) => {
    if (busy) return;
    if (flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setBusy(true);
      setMoves((m) => m + 1);

      const [a, b] = newFlipped;
      if (cards[a] === cards[b]) {
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header logout={handleLogout}/>

      <main className="flex-1 max-w-5xl mx-auto px-6 py-10">
        {/* Encabezado */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">🧩 Juego de Memoria</h1>
            <p className="text-gray-600 mt-1">
              Encuentra las parejas. Fácil, accesible y divertido.
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

        {/* Info del juego */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="text-gray-700">
            Movimientos: <span className="font-semibold">{moves}</span>
            {" — "}
            Parejas encontradas:{" "}
            <span className="font-semibold">{matched.length / 2}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetGame}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
              aria-label="Reiniciar juego"
            >
              Reiniciar
            </button>
          </div>
        </div>

        {/* Grid de cartas */}
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
          }}
        >
          {cards.map((symbol, idx) => {
            const isFlipped = flipped.includes(idx) || matched.includes(idx);

            return (
              <button
                key={idx}
                onClick={() => handleFlip(idx)}
                disabled={busy || matched.includes(idx)}
                aria-label={isFlipped ? `Carta ${symbol}` : "Carta boca abajo"}
                className={`relative aspect-square rounded-2xl shadow-md overflow-hidden transform transition-all duration-300
                  ${
                    isFlipped
                      ? "bg-white"
                      : "bg-gradient-to-br from-blue-500 to-indigo-500"
                  }
                  flex items-center justify-center focus:outline-none`}
              >
                {!isFlipped && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-2xl select-none">🎴</div>
                  </div>
                )}

                {isFlipped && (
                  <div className="z-10 text-4xl select-none text-slate-800">
                    {symbol}
                  </div>
                )}

                {matched.includes(idx) && (
                  <div className="absolute inset-0 bg-white/40 pointer-events-none animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {allMatched && (
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-semibold text-green-600 mb-3">
              ¡Genial! 🎉 Completaste el juego
            </h2>
            <button
              onClick={resetGame}
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
            >
              Volver a jugar
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
