export default function Teams({ teams, activeTeam, setActiveTeam }) {
  function nextTeam() {
    setActiveTeam((prev) => (prev + 1) % teams.length);
  }
  function prevTeam() {
    setActiveTeam((prev) => (prev - 1 + teams.length) % teams.length);
  }

  return (
    <section className="bg-slate-800/60 border border-slate-700 rounded-xl shadow-lg backdrop-blur p-4 space-y-3">
      <h3 className="text-lg font-bold">👥 Equipos</h3>

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
              type="text"
              value={t.name}
              onChange={(e) => {
                const newTeams = [...teams];
                newTeams[i].name = e.target.value;
              }}
              className="bg-transparent flex-1 focus:outline-none"
            />
            <span className="font-bold">{t.score}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 justify-center">
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
