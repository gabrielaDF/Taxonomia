import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center p-6">
      <div className="bg-slate-900/70 backdrop-blur-md border border-slate-700 rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
        <h1 className="text-3xl font-bold text-teal-400 mb-6">
          Selecciona el modo de juego
        </h1>

        <p className="text-slate-300 mb-8 text-sm">
          Elige una modalidad para comenzar a practicar la Taxonomía de Bloom.
        </p>

        <div className="flex flex-col gap-4">
          {/* Modo Individual (Próximamente) */}
          <Link
            to="/solo"
            className="w-full py-3 rounded-xl bg-slate-800 border border-slate-600
                       hover:bg-slate-700 hover:border-teal-400 transition text-slate-200 font-semibold"
          >
            🧍 Práctica Individual
          </Link>

          {/* Modo Equipos */}
          <Link
            to="/equipos"
            className="w-full py-3 rounded-xl bg-teal-600 border border-teal-500
                       hover:bg-teal-500 transition text-white font-semibold shadow-lg"
          >
            👥 Juego por Equipos
          </Link>
        </div>
      </div>
    </div>
  );
}
