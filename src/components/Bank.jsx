export default function Bank({ verbs, onDrop }) {
  function handleDrop(e) {
    e.preventDefault();
    const verb = e.dataTransfer.getData("text/plain");
    if (verb) onDrop(verb);
  }

  return (
    <section
      className="bg-slate-800/60 border border-slate-700 rounded-xl shadow-lg backdrop-blur p-4"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <h3 className="text-lg font-bold mb-3">🗂️ Verbos desordenados</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {verbs.map((verb, idx) => (
          <div
            key={idx}
            className="px-3 py-2 rounded-lg border border-slate-600 bg-slate-900 text-center font-semibold cursor-grab hover:bg-slate-700"
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
