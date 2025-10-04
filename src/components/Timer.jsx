export default function Timer({ timeLeft, setTimeLeft, running, setRunning }) {
  function formatTime(t) {
    const m = Math.floor(t / 60)
      .toString()
      .padStart(2, "0");
    const s = (t % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  return (
    <section className="bg-slate-800/60 border border-slate-700 rounded-xl shadow-lg backdrop-blur p-4 space-y-3">
      <h3 className="text-lg font-bold">⏱️ Cronómetro</h3>

      <div className="text-2xl font-extrabold text-center tracking-widest">
        <span className={timeLeft <= 10 ? "text-red-400" : ""}>
          {formatTime(timeLeft)}
        </span>
      </div>

      <div className="flex gap-2 justify-center">
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
            setTimeLeft(300); // reinicia a 5 min
          }}
          className="px-3 py-1 rounded-lg border border-slate-600 bg-slate-900 hover:border-teal-400"
        >
          ↺ Reiniciar
        </button>
      </div>
    </section>
  );
}
