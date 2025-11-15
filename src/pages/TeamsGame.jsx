import { useState, useEffect, useMemo } from "react";
import Header from "../components/Header";
import Panel from "../components/Panel";
import Bank from "../components/Bank";
import Timer from "../components/Timer";
import Teams from "../components/Teams";
import Modal from "../components/Modal";
import { DATA } from "../data/verbs";
import { ding, buzz } from "../utils/sounds";

function allVerbsWithLevels(dim) {
  return Object.entries(DATA[dim]).flatMap(([lvl, verbs]) =>
    verbs.map((v) => ({ verb: v, level: Number(lvl) }))
  );
}

export default function TeamsGame() {
  // Core
  const [dimension, setDimension] = useState("saber");
  const [bankVerbs, setBankVerbs] = useState(() => allVerbsWithLevels("saber"));
  const [levels, setLevels] = useState({ 1: [], 2: [], 3: [], 4: [] });
  const [turnModal, setTurnModal] = useState(null);

  // Equipos
  const [teams, setTeams] = useState([
    { name: "Equipo 1", score: 0 },
    { name: "Equipo 2", score: 0 },
  ]);
  const [activeTeam, setActiveTeam] = useState(0);

  // Temporizadores por equipo
  const [running, setRunning] = useState(false);
  const [startModalOpen, setStartModalOpen] = useState(true);
  const [teamTimers, setTeamTimers] = useState(
    teams.map(() => ({ elapsed: 0, running: false }))
  );

  // Modal y modo examen
  const [examMode, setExamMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [finalMsg, setFinalMsg] = useState("");

  // Contadores
  const okCount = useMemo(
    () => [1, 2, 3, 4].reduce((acc, lvl) => acc + levels[lvl].length, 0),
    [levels]
  );
  const totalCount = useMemo(
    () => Object.values(DATA[dimension]).reduce((a, arr) => a + arr.length, 0),
    [dimension]
  );
  const leftCount = totalCount - okCount;

  // 🔁 Efecto para incrementar el tiempo del equipo activo
  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      setTeamTimers((prev) =>
        prev.map((t, i) =>
          i === activeTeam && t.running ? { ...t, elapsed: t.elapsed + 1 } : t
        )
      );
    }, 1000);

    return () => clearInterval(id);
  }, [running, activeTeam]);

  // 🔄 Sincronizar qué cronómetro está corriendo
  useEffect(() => {
    setTeamTimers((prev) =>
      prev.map((t, i) => ({
        ...t,
        running: running && i === activeTeam,
      }))
    );
  }, [activeTeam, running]);

  // 🔧 Sincronizar longitud de timers con equipos
  useEffect(() => {
    setTeamTimers((prev) =>
      Array.from({ length: teams.length }, (_, i) => ({
        elapsed: prev[i]?.elapsed ?? 0,
        running: prev[i]?.running ?? false,
      }))
    );
  }, [teams]);

  // Dimensión
  function switchDimension(dim) {
    setDimension(dim);
    setBankVerbs(allVerbsWithLevels(dim));
    setLevels({ 1: [], 2: [], 3: [], 4: [] });
  }

  // Drag & Drop principal
  function handleDrop(targetLevel, verb, target = "level") {
    if (!running) return; // No hacer nada si no está corriendo el juego
    const fromBank = bankVerbs.find((v) => v.verb === verb);
    const fromLevels =
      fromBank ||
      Object.values(levels)
        .flat()
        .find((v) => v.verb === verb);

    if (!fromLevels) return;

    // Si lo soltamos en el banco → regresar
    if (target === "bank") {
      setBankVerbs((prev) => [...prev, fromLevels]);
      setLevels((prev) => {
        const copy = { ...prev };
        [1, 2, 3, 4].forEach((lvl) => {
          copy[lvl] = copy[lvl].filter((v) => v.verb !== verb);
        });
        return copy;
      });
      return;
    }

    const isCorrect = fromLevels.level === targetLevel;

    if (isCorrect) {
      // ✅ ACIERTO
      setLevels((prev) => ({
        ...prev,
        [targetLevel]: [...prev[targetLevel], fromLevels],
      }));

      setBankVerbs((prev) => prev.filter((v) => v.verb !== verb));
      addPoints(+10);
      ding();
      if (navigator.vibrate) navigator.vibrate(60);

      // Verificar si ya completó todos los verbos
      const totalNow = Object.values(DATA[dimension]).reduce(
        (a, arr) => a + arr.length,
        0
      );
      const okNow =
        Object.values(levels).reduce((a, arr) => a + arr.length, 0) + 1;
      if (totalNow - okNow <= 0) endRound();

      return; // mismo equipo continúa
    }

    // ❌ ERROR
    buzz();
    if (navigator.vibrate) navigator.vibrate(80);
    if (examMode) addPoints(-5);

    // 🔁 Cambio de turno (sin manipular timers manualmente)
    setActiveTeam((prevActive) => {
      const next = (prevActive + 1) % teams.length;
      const nextName = teams[next]?.name || `Equipo ${next + 1}`;
      const failedName = teams[prevActive]?.name || `Equipo ${prevActive + 1}`;

      setTurnModal({
        failed: `❌ ${failedName} falló`,
        next: `🎯 Turno de ${nextName}`,
      });

      return next;
    });
  }

  // Ordenar / desordenar banco
  function sortBankAZ() {
    setBankVerbs((prev) =>
      [...prev].sort((a, b) =>
        a.verb.localeCompare(b.verb, "es", { sensitivity: "base" })
      )
    );
  }
  function shuffleBank() {
    setBankVerbs((prev) => {
      const arr = [...prev];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    });
  }

  // Puntuación
  function addPoints(points) {
    setTeams((prevTeams) => {
      const updated = [...prevTeams];
      updated[activeTeam] = {
        ...updated[activeTeam],
        score: updated[activeTeam].score + points,
      };
      return updated;
    });
  }

  // Fin de ronda
  function endRound() {
    setRunning(false);

    const maxScore = Math.max(...teams.map((t) => t.score));
    const winnersIdx = teams
      .map((t, i) => ({ i, score: t.score }))
      .filter((t) => t.score === maxScore)
      .map((t) => t.i);

    // Calcular equipo más rápido
    const fastest = teamTimers.reduce(
      (min, t, i) => (t.elapsed < teamTimers[min].elapsed ? i : min),
      0
    );
    const fastestName = teams[fastest]?.name || `Equipo ${fastest + 1}`;

    // Bonus de velocidad
    const timeBonus = Math.max(
      0,
      Math.floor((300 - teamTimers[fastest].elapsed) / 15)
    );

    const withBonus = teams.map((t, i) =>
      winnersIdx.includes(i) ? { ...t, score: t.score + timeBonus } : t
    );
    setTeams(withBonus);

    const maxAfter = Math.max(...withBonus.map((t) => t.score));
    const winnersAfter = withBonus.filter((t) => t.score === maxAfter);

    const summary =
      withBonus.map((t) => `${t.name}: ${t.score} pts`).join(" · ") +
      (winnersAfter.length === 1
        ? ` | 🏆 Ganador: ${winnersAfter[0].name}`
        : " | 🤝 ¡Empate!");

    setFinalMsg(
      `Fin de la ronda. ${summary} 🕓 Más rápido: ${fastestName} (${Math.floor(
        teamTimers[fastest].elapsed / 60
      )}m ${teamTimers[fastest].elapsed % 60}s)`
    );
    setModalOpen(true);
  }

  // Reset global
  function resetGame() {
    setBankVerbs(allVerbsWithLevels(dimension));
    setLevels({ 1: [], 2: [], 3: [], 4: [] });
    setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })));
    setActiveTeam(0);
    setTeamTimers(teams.map(() => ({ elapsed: 0, running: false })));
    setRunning(false);
    setExamMode(false);
    setModalOpen(false);
    setFinalMsg("");
  }

  // Cambiar cantidad de equipos
  function applyTeamCount(n) {
    const count = Math.min(4, Math.max(2, n));
    setTeams((prev) =>
      Array.from({ length: count }, (_, i) => ({
        name: prev[i]?.name ?? `Equipo ${i + 1}`,
        score: prev[i]?.score ?? 0,
      }))
    );
    setActiveTeam(0);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100">
      <Header onReset={resetGame} />

      <main className="p-6 grid gap-6 max-w-7xl mx-auto md:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Panel
            dimension={dimension}
            onChangeDimension={switchDimension}
            levels={levels}
            onDrop={handleDrop}
            examMode={examMode}
            okCount={okCount}
            totalCount={totalCount}
            leftCount={leftCount}
          />

          <Bank
            verbs={bankVerbs.map((v) => v.verb)}
            onDrop={(verb) => handleDrop(null, verb, "bank")}
            onSortAZ={sortBankAZ}
            onShuffle={shuffleBank}
            dimension={dimension}
          />
        </div>

        <div className="space-y-6">
          <Timer
            running={running}
            setRunning={setRunning}
            examMode={examMode}
            setExamMode={setExamMode}
          />
          <Teams
            teams={teams}
            setTeams={setTeams}
            activeTeam={activeTeam}
            setActiveTeam={setActiveTeam}
            onApplyTeamCount={applyTeamCount}
            teamTimers={teamTimers}
          />
        </div>
      </main>

      {/* Modal final */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onReset={resetGame}
        message={finalMsg}
      />

      {/* Modal de cambio de turno */}
      {turnModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-sm w-full text-center shadow-xl animate-fade-in">
            <h2 className="text-xl font-bold text-red-400 mb-2">
              {turnModal.failed}
            </h2>
            <h3 className="text-lg font-semibold text-teal-400 mb-4">
              {turnModal.next}
            </h3>
            <button
              onClick={() => setTurnModal(null)}
              className="px-4 py-2 rounded-lg border border-teal-500 text-teal-200 bg-slate-800 hover:bg-teal-600 hover:text-white font-semibold transition"
            >
              ✅ Aceptar
            </button>
          </div>
        </div>
      )}

      {/* Modal inicial */}
      {startModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70]">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-sm w-full text-center shadow-xl animate-fade-in">
            <h2 className="text-2xl font-bold text-teal-400 mb-4">
              🎬 ¡Listos para comenzar!
            </h2>
            <p className="text-slate-300 mb-4">
              Presiona <strong>Aceptar</strong> para iniciar el juego. Comienza
              el turno de <strong>{teams[0].name}</strong>.
            </p>
            <button
              onClick={() => {
                setStartModalOpen(false);
                setRunning(true);
                setActiveTeam(0);
              }}
              className="px-4 py-2 rounded-lg border border-teal-500 text-teal-200 bg-slate-800 hover:bg-teal-600 hover:text-white font-semibold transition"
            >
              ✅ Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
