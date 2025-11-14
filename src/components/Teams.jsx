export default function Teams({
  teams,
  setTeams,
  activeTeam,
  setActiveTeam,
  onApplyTeamCount,
  teamTimers = [], // ← valor por defecto evita undefined
}) {
  function nextTeam() {
    setActiveTeam((prev) => (prev + 1) % teams.length);
  }
  function prevTeam() {
    setActiveTeam((prev) => (prev - 1 + teams.length) % teams.length);
  }

  return (
    <section className="bg-slate-800/60 border border-slate-700 rounded-xl shadow-lg backdrop-blur p-4 space-y-3">
      <h3 className="text-lg font-bold text-teal-400">👥 Equipos</h3>

      {/* Selector de cantidad */}
      <div className="flex items-center gap-2">
        <label className="text-sm">N° de equipos</label>
        <select
          onChange={(e) => onApplyTeamCount(Number(e.target.value))}
          className="bg-slate-900 border border-slate-600 rounded px-2 py-1"
          value={teams.length}
        >
          <option>2</option>
          <option>3</option>
          <option>4</option>
        </select>
      </div>

      {/* Lista de equipos */}
      <div className="grid gap-2">
        {teams.map((t, i) => {
          const timer = teamTimers[i] || { elapsed: 0 }; // fallback seguro
          const minutes = String(Math.floor(timer.elapsed / 60)).padStart(
            2,
            "0"
          );
          const seconds = String(timer.elapsed % 60).padStart(2, "0");

          return (
            <div
              key={i}
              className={`flex justify-between items-center px-3 py-2 rounded-lg border transition-all duration-300 ${
                i === activeTeam
                  ? "border-teal-400 bg-slate-900 shadow-[0_0_12px_#14b8a6] animate-pulse"
                  : "border-slate-700 bg-slate-900/70"
              }`}
            >
              {/* Nombre del equipo */}
              <input
                value={t?.name || ""}
                onChange={(e) =>
                  setTeams((prev) => {
                    const copy = [...prev];
                    if (copy[i]) copy[i] = { ...copy[i], name: e.target.value };
                    return copy;
                  })
                }
                className="bg-transparent outline-none font-semibold w-28 text-slate-200"
              />

              {/* Puntaje y tiempo */}
              <div className="text-right">
                <span className="block font-bold text-teal-300">
                  {Number.isFinite(t?.score) ? t.score : 0} pts
                </span>
                <span className="text-s text-slate-400">
                  ⏱️ {minutes}:{seconds}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controles */}
      <div className="flex gap-2">
        <button
          onClick={prevTeam}
          className="px-3 py-1 rounded-lg border border-slate-600 bg-slate-900 hover:border-teal-400 transition"
        >
          ◀ Anterior
        </button>
        <button
          onClick={nextTeam}
          className="px-3 py-1 rounded-lg border border-slate-600 bg-slate-900 hover:border-teal-400 transition"
        >
          Siguiente ▶
        </button>
      </div>
    </section>
  );
}
