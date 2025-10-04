export default function Header({ onReset }) {
  return (
    <header className="p-6 border-b border-slate-700 bg-slate-900 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-teal-400">
          Taxonomía de Bloom – Equipos + Cronómetro + Examen
        </h1>
        <p className="text-slate-400 text-sm">
          Arrastra los verbos al nivel correcto de la escalera según la
          dimensión seleccionada.
        </p>
      </div>

      <button
        onClick={onReset}
        className="px-4 py-2 mt-2 md:mt-0 rounded-lg border border-slate-600 bg-slate-800 hover:border-red-400 text-red-300 font-semibold"
      >
        🔄 Reiniciar Todo
      </button>
    </header>
  );
}
