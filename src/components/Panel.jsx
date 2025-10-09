import { DATA } from "../data/verbs";

export default function Panel({
  dimension,
  onChangeDimension,
  levels,
  onDrop,
  examMode,
  okCount,
  totalCount,
  leftCount,
}) {
  function handleDrop(e, level) {
    e.preventDefault();
    const verb = e.dataTransfer.getData("text/plain");
    if (verb) onDrop(level, verb, "level");
  }

  function remainingFor(lvl) {
    const all = DATA[dimension][lvl];
    const placed = new Set(levels[lvl].map((v) => v.verb));
    return all.filter((v) => !placed.has(v));
  }

  return (
    <section className="bg-slate-800/60 border border-slate-700 rounded-xl shadow-lg backdrop-blur">
      {/* TOP BAR (HUD + Controles) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 p-3">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="px-3 py-1 border border-slate-600 rounded-full bg-slate-900 font-bold">
            Aciertos: <strong>{okCount}</strong>/<strong>{totalCount}</strong>
          </span>
          <span className="px-3 py-1 border border-slate-600 rounded-full bg-slate-900 font-bold">
            Restantes: <strong>{leftCount}</strong>
          </span>
          {examMode && (
            <span className="px-3 py-1 border border-rose-500 text-rose-300 rounded-full bg-slate-900 font-bold">
              Modo Examen
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label className="px-3 py-1 border border-slate-600 rounded-full bg-slate-900 font-bold">
            Dimensión
          </label>
          <select
            value={dimension}
            onChange={(e) => onChangeDimension(e.target.value)}
            className="bg-slate-900 border border-slate-600 rounded px-2 py-1"
          >
            <option value="saber">SABER (Cognitivo)</option>
            <option value="hacer">HACER (Psicomotor)</option>
            <option value="ser">SER (Afectivo)</option>
          </select>
        </div>
      </div>

      {/* Escalera */}
      <div className="p-4">
        <div className="relative h-20 mb-4 overflow-visible">
          {/* Peldaño 1 */}
          <div
            className="absolute top-0 left-0 w-[28%] h-20 bg-red-700 border border-black/30 rounded-lg 
                  flex items-center justify-center text-white font-extrabold text-2xl shadow-lg z-[1]"
          >
            1
          </div>

          {/* Peldaño 2 */}
          <div
            className="absolute top-0 left-[25%] w-[28%] h-20 bg-orange-600 border border-black/30 rounded-lg 
                  flex items-center justify-center text-white font-extrabold text-2xl shadow-lg z-[2]"
          >
            2
          </div>

          {/* Peldaño 3 */}
          <div
            className="absolute top-0 left-[50%] w-[28%] h-20 bg-yellow-500 border border-black/30 rounded-lg 
                  flex items-center justify-center text-white font-extrabold text-2xl shadow-lg z-[3]"
          >
            3
          </div>

          {/* Peldaño 4 */}
          <div
            className="absolute top-0 left-[75%] w-[25%] h-20 bg-green-600 border border-black/30 rounded-lg 
                  flex items-center justify-center text-white font-extrabold text-2xl shadow-lg z-[4]"
          >
            4
          </div>
        </div>

        {/* Niveles con pistas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((lvl) => {
            const rem = remainingFor(lvl);
            return (
              <div
                key={lvl}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, lvl)}
                className="relative border-2 border-dashed border-slate-600 rounded-xl p-3 min-h-[140px] bg-slate-900"
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

                {/* Hints (solo si NO es examen y hay restantes) */}
                {!examMode && rem.length > 0 && (
                  <div className="absolute right-2 bottom-2 text-xs text-white/90">
                    {rem.join(", ")}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
