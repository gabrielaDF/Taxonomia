export default function Timer({ running, setRunning, examMode, setExamMode }) {
  return (
    <section className="bg-slate-800/60 border border-slate-700 rounded-xl shadow-lg backdrop-blur p-4 space-y-4">
      <h3 className="text-lg font-bold text-teal-400">⏱️ Control del Juego</h3>

      <div className="flex justify-between items-center">
        <span className="text-slate-300 text-sm">
          {running ? "Juego en curso" : "Juego detenido"}
        </span>
        <button
          onClick={() => setRunning((prev) => !prev)}
          className={`px-3 py-1 rounded-lg font-semibold transition ${
            running
              ? "bg-red-700 hover:bg-red-800 text-white border border-red-500"
              : "bg-green-700 hover:bg-green-800 text-white border border-green-500"
          }`}
        >
          {running ? "⏸️ Pausar" : "▶️ Reanudar"}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={examMode}
            onChange={(e) => setExamMode(e.target.checked)}
            className="w-4 h-4 accent-teal-500"
          />
          <span className="text-slate-300 text-sm">Modo examen</span>
        </label>
      </div>
    </section>
  );
}
