export default function Modal({ open, onClose, onReset, message }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50">
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full text-center shadow-lg">
        <h3 className="text-xl font-bold text-teal-400 mb-2">
          🎉 ¡Fin de la ronda!
        </h3>
        <p className="text-slate-300 mb-4">{message}</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-600 bg-slate-800 hover:border-slate-400"
          >
            ✖ Cerrar
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-lg border border-red-500 bg-red-700 hover:bg-red-600 text-white"
          >
            🔄 Reiniciar Todo
          </button>
        </div>
      </div>
    </div>
  );
}
