import { useState, useEffect, useMemo } from "react";
import Header from "./components/Header";
import Panel from "./components/Panel";
import Bank from "./components/Bank";
import Timer from "./components/Timer";
import Teams from "./components/Teams";
import Modal from "./components/Modal";
import { DATA } from "./data/verbs";
import { ding, buzz } from "./utils/sounds";

function allVerbsWithLevels(dim) {
  return Object.entries(DATA[dim]).flatMap(([lvl, verbs]) =>
    verbs.map((v) => ({ verb: v, level: Number(lvl) }))
  );
}

export default function App() {
  // Core
  const [dimension, setDimension] = useState("saber");
  const [bankVerbs, setBankVerbs] = useState(() => allVerbsWithLevels("saber"));
  const [levels, setLevels] = useState({ 1: [], 2: [], 3: [], 4: [] });

  // Equipos
  const [teams, setTeams] = useState([
    { name: "Equipo 1", score: 0 },
    { name: "Equipo 2", score: 0 },
  ]);
  const [activeTeam, setActiveTeam] = useState(0);

  // Timer & Examen
  const [timeLeft, setTimeLeft] = useState(300); // 5:00
  const [running, setRunning] = useState(false);
  const [examMode, setExamMode] = useState(false);

  // Modal
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

  // Timer
  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) {
      endRound();
      return;
    }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [running, timeLeft]);

  // Dimensión
  function switchDimension(dim) {
    setDimension(dim);
    setBankVerbs(allVerbsWithLevels(dim));
    setLevels({ 1: [], 2: [], 3: [], 4: [] });
  }

  // Drag & Drop
  function handleDrop(targetLevel, verb, target = "level") {
    const fromBank = bankVerbs.find((v) => v.verb === verb);
    const fromLevels =
      fromBank ||
      Object.values(levels)
        .flat()
        .find((v) => v.verb === verb);
    if (!fromLevels) return;

    if (target === "bank") {
      // devolver al banco
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

    // Validación (solo si cae en un nivel)
    if (fromLevels.level === targetLevel) {
      // ✅ acierto
      setLevels((prev) => ({
        ...prev,
        [targetLevel]: [...prev[targetLevel], fromLevels],
      }));
      setBankVerbs((prev) => prev.filter((v) => v.verb !== verb));
      addPoints(10);
      ding();
      checkWin(leftCount - 1); // uno menos al colocar correcto
    } else {
      // ❌ error
      buzz();
      if (examMode) {
        addPoints(-5);
        setActiveTeam((p) => (p + 1) % teams.length);
      }
      // no movemos, se queda donde estaba (en banco)
    }
  }

  // Banco: ordenar / desordenar
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

  // Equipos
  function addPoints(points) {
    setTeams((prev) => {
      const copy = [...prev];
      copy[activeTeam] = {
        ...copy[activeTeam],
        score: copy[activeTeam].score + points,
      };
      return copy;
    });
  }

  // Fin de ronda + bonus por tiempo
  function endRound() {
    setRunning(false);
    // otorgar bonus (1 punto cada 15s) a ganadores actuales
    const maxScore = Math.max(...teams.map((t) => t.score));
    const winnersIdx = teams
      .map((t, i) => ({ i, score: t.score }))
      .filter((t) => t.score === maxScore)
      .map((t) => t.i);

    const timeBonus = Math.floor(timeLeft / 15);
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

    setFinalMsg(`Fin de la ronda. ${summary}`);
    setModalOpen(true);
  }

  // Reset global
  function resetGame() {
    setBankVerbs(allVerbsWithLevels(dimension));
    setLevels({ 1: [], 2: [], 3: [], 4: [] });
    setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })));
    setActiveTeam(0);
    setTimeLeft(300);
    setRunning(false);
    setExamMode(false);
    setModalOpen(false);
    setFinalMsg("");
  }

  // Cambiar cantidad de equipos (2-4)
  function applyTeamCount(n) {
    const count = Math.min(4, Math.max(2, n));
    setTeams((prev) => {
      const next = Array.from({ length: count }, (_, i) => ({
        name: prev[i]?.name ?? `Equipo ${i + 1}`,
        score: prev[i]?.score ?? 0,
      }));
      return next;
    });
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
            // HUD
            okCount={okCount}
            totalCount={totalCount}
            leftCount={leftCount}
          />

          <Bank
            verbs={bankVerbs.map((v) => v.verb)}
            onDrop={(verb) => handleDrop(null, verb, "bank")}
            onSortAZ={sortBankAZ}
            onShuffle={shuffleBank}
            disabledShuffle={examMode && running}
            dimension={dimension}
          />
        </div>

        <div className="space-y-6">
          <Timer
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
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
          />
        </div>
      </main>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onReset={resetGame}
        message={finalMsg}
      />
    </div>
  );
}
