export default function Header({ onReset }) {
  return (
    <header className="px-4 py-2 sm:px-6 sm:py-3 border-b border-slate-700 bg-slate-900 flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-teal-400 leading-tight">
          Taxonomía de Bloom – Equipos + Cronómetro + Examen
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm truncate">
          Arrastra los verbos al nivel correcto según la dimensión seleccionada.
        </p>
      </div>

      <button
        onClick={onReset}
        className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-slate-600 bg-slate-800 hover:border-red-400 text-red-300 font-semibold text-sm sm:text-base"
      >
        🔄 Reiniciar Todo
      </button>
    </header>
  );
}
