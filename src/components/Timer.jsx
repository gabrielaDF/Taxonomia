export default function Timer({
  timeLeft,
  setTimeLeft,
  running,
  setRunning,
  examMode,
  setExamMode,
}) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  function setMinutes(m) {
    if (running) return;
    const mm = Math.max(0, Number(m) || 0);
    setTimeLeft(mm * 60 + seconds);
  }
  function setSeconds(s) {
    if (running) return;
    const ss = Math.max(0, Math.min(59, Number(s) || 0));
    setTimeLeft(minutes * 60 + ss);
  }
  function fmt(n) {
    return String(n).padStart(2, "0");
  }

  return (
    <section className="bg-slate-800/60 border border-slate-700 rounded-xl shadow-lg backdrop-blur p-4 space-y-3">
      <h3 className="text-lg font-bold">⏱️ Cronómetro</h3>

      <div className="flex items-center gap-2">
        <label className="text-sm">Min:</label>
        <input
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          disabled={running}
          className="w-16 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-center disabled:opacity-60"
        />
        <label className="text-sm">Seg:</label>
        <input
          type="number"
          value={seconds}
          onChange={(e) => setSeconds(e.target.value)}
          disabled={running}
          className="w-16 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-center disabled:opacity-60"
        />
      </div>

      <div className="text-3xl font-extrabold text-center tracking-widest">
        <span className={timeLeft <= 10 ? "text-rose-300" : ""}>
          {fmt(minutes)}:{fmt(seconds)}
        </span>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setRunning(true)}
          className="px-3 py-1 rounded-lg border border-slate-600 bg-slate-900 hover:border-teal-400"
        >
          ▶ Iniciar
        </button>
        <button
          onClick={() => setRunning(false)}
          className="px-3 py-1 rounded-lg border border-slate-600 bg-slate-900 hover:border-teal-400"
        >
          ⏸ Pausa
        </button>
        <button
          onClick={() => {
            setRunning(false);
            setTimeLeft(300);
          }}
          className="px-3 py-1 rounded-lg border border-slate-600 bg-slate-900 hover:border-teal-400"
        >
          ↺ Reiniciar
        </button>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={examMode}
          onChange={(e) => setExamMode(e.target.checked)}
        />
        Modo Examen
      </label>
      {examMode && (
        <small className="block text-slate-400">
          En examen: se ocultan pistas y los errores restan puntos y cambian el
          turno.
        </small>
      )}
    </section>
  );
}
