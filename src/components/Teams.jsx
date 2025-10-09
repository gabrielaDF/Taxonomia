export default function Teams({
  teams,
  setTeams,
  activeTeam,
  setActiveTeam,
  onApplyTeamCount,
}) {
  function nextTeam() {
    setActiveTeam((prev) => (prev + 1) % teams.length);
  }
  function prevTeam() {
    setActiveTeam((prev) => (prev - 1 + teams.length) % teams.length);
  }

  return (
    <section className="bg-slate-800/60 border border-slate-700 rounded-xl shadow-lg backdrop-blur p-4 space-y-3">
      <h3 className="text-lg font-bold">👥 Equipos</h3>

      <div className="flex items-center gap-2">
        <label className="text-sm">N° de equipos</label>
        <select
          onChange={(e) => onApplyTeamCount(Number(e.target.value))}
          className="bg-slate-900 border border-slate-600 rounded px-2 py-1"
          defaultValue={teams.length}
        >
          <option>2</option>
          <option>3</option>
          <option>4</option>
        </select>
      </div>

      <div className="grid gap-2">
        {teams.map((t, i) => (
          <div
            key={i}
            className={`flex justify-between items-center px-3 py-2 rounded-lg border ${
              i === activeTeam
                ? "border-violet-400 bg-slate-900"
                : "border-slate-600 bg-slate-900/70"
            }`}
          >
            <input
              value={t.name}
              onChange={(e) =>
                setTeams((prev) => {
                  const copy = [...prev];
                  copy[i] = { ...copy[i], name: e.target.value };
                  return copy;
                })
              }
              className="bg-transparent outline-none font-semibold"
            />
            <span className="font-bold">{t.score} pts</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={prevTeam}
          className="px-3 py-1 rounded-lg border border-slate-600 bg-slate-900 hover:border-teal-400"
        >
          ◀ Anterior
        </button>
        <button
          onClick={nextTeam}
          className="px-3 py-1 rounded-lg border border-slate-600 bg-slate-900 hover:border-teal-400"
        >
          Siguiente ▶
        </button>
      </div>
    </section>
  );
}
