// src/components/Bank.jsx
export default function Bank({
  verbs,
  onDrop,
  onSortAZ,
  onShuffle,
  disabledShuffle,
  dimension,
}) {
  function handleDrop(e) {
    e.preventDefault();
    const verb = e.dataTransfer.getData("text/plain");
    if (verb) onDrop(verb);
  }

  // Colores según dimensión (basado en el original)
  const dimColors = {
    saber: {
      border: "border-cyan-400/40",
      bg: "bg-cyan-900/20",
      hover: "hover:bg-cyan-900/40",
    },
    hacer: {
      border: "border-orange-400/40",
      bg: "bg-orange-900/20",
      hover: "hover:bg-orange-900/40",
    },
    ser: {
      border: "border-emerald-400/40",
      bg: "bg-emerald-900/20",
      hover: "hover:bg-emerald-900/40",
    },
  };

  const current = dimColors[dimension] || dimColors.saber;

  return (
    <section
      className="bg-slate-800/60 border border-slate-700 rounded-xl shadow-lg backdrop-blur p-4"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="text-lg font-bold">
          🗂️ Verbos desordenados{" "}
          <small className="text-slate-400">
            ({dimension?.toUpperCase?.()})
          </small>
        </h3>

        <div className="flex gap-2">
          <button
            onClick={onSortAZ}
            className="px-3 py-1 rounded-lg border border-slate-600 bg-slate-900 hover:border-slate-400"
            type="button"
          >
            🔤 Ordenar A–Z
          </button>

          <button
            onClick={onShuffle}
            disabled={!!disabledShuffle}
            className={`px-3 py-1 rounded-lg border ${
              disabledShuffle
                ? "border-slate-700 bg-slate-800 text-slate-500 cursor-not-allowed"
                : "border-slate-600 bg-slate-900 hover:border-slate-400"
            }`}
            title={
              disabledShuffle
                ? "Bloqueado en examen mientras corre el tiempo"
                : "Desordenar"
            }
            type="button"
          >
            🔀 Desordenar
          </button>
        </div>
      </div>

      {/* Verbos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {verbs.map((verb, idx) => (
          <div
            key={`${verb}-${idx}`}
            className={`px-3 py-2 rounded-lg border ${current.border} ${current.bg} ${current.hover} text-center font-semibold cursor-grab transition`}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("text/plain", verb)}
          >
            {verb}
          </div>
        ))}
      </div>
    </section>
  );
}
