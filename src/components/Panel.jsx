export default function Panel({
  dimension,
  levels,
  onDrop,
  onChangeDimension,
}) {
  function handleDrop(e, level) {
    e.preventDefault();
    const verb = e.dataTransfer.getData("text/plain");
    if (verb) onDrop(level, verb, "level");
  }

  return (
    <section className="bg-slate-800/60 border border-slate-700 rounded-xl shadow-lg backdrop-blur p-4">
      {/* Encabezado */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-700 py-3 font-bold">
        <span>
          {dimension === "saber"
            ? "📘 SABER (Cognitivo)"
            : dimension === "hacer"
            ? "🛠️ HACER (Psicomotor)"
            : "🤝 SER (Afectivo)"}
        </span>
        <select
          value={dimension}
          onChange={(e) => onChangeDimension(e.target.value)}
          className="bg-slate-900 border border-slate-600 rounded px-2 py-1"
        >
          <option value="saber">SABER</option>
          <option value="hacer">HACER</option>
          <option value="ser">SER</option>
        </select>
      </div>

      {/* Escalera */}
      <div className="relative h-20 my-6">
        <div className="absolute top-0 left-0 w-1/4 h-20 bg-red-700 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow border border-black/30">
          1
        </div>
        <div className="absolute top-0 left-1/4 w-1/4 h-20 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow border border-black/30">
          2
        </div>
        <div className="absolute top-0 left-2/4 w-1/4 h-20 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow border border-black/30">
          3
        </div>
        <div className="absolute top-0 left-3/4 w-1/4 h-20 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow border border-black/30">
          4
        </div>
      </div>

      {/* Dropzones */}
      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((lvl) => (
          <div
            key={lvl}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, lvl)}
            className="border-2 border-dashed border-slate-600 rounded-xl p-3 min-h-[140px] bg-slate-900"
          >
            <h4 className="text-sm text-slate-300 mb-2">
              {lvl === 1 && "Nivel 1 – Bajo"}
              {lvl === 2 && "Nivel 2 – Básico"}
              {lvl === 3 && "Nivel 3 – Alto"}
              {lvl === 4 && "Nivel 4 – Superior"}
            </h4>
            <div className="flex flex-wrap gap-2 min-h-[60px]">
              {levels[lvl].map((v, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 rounded-lg border border-teal-600 bg-teal-900/40 text-center font-semibold cursor-grab"
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("text/plain", v.verb)
                  }
                >
                  {v.verb}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
