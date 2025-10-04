import { useState, useEffect } from "react";
import Header from "./components/Header";
import Panel from "./components/Panel";
import Bank from "./components/Bank";
import Timer from "./components/Timer";
import Teams from "./components/Teams";
import Modal from "./components/Modal";
import { DATA } from "./data/verbs";
import { ding, buzz } from "./utils/sounds";

function App() {
  // === Estados principales ===
  const [dimension, setDimension] = useState("saber");
  const [bankVerbs, setBankVerbs] = useState(() =>
    Object.entries(DATA["saber"]).flatMap(([lvl, verbs]) =>
      verbs.map((v) => ({ verb: v, level: +lvl }))
    )
  );
  const [levels, setLevels] = useState({ 1: [], 2: [], 3: [], 4: [] });

  const [teams, setTeams] = useState([
    { name: "Equipo 1", score: 0 },
    { name: "Equipo 2", score: 0 },
  ]);
  const [activeTeam, setActiveTeam] = useState(0);

  // Timer
  const [timeLeft, setTimeLeft] = useState(300); // 5 min
  const [running, setRunning] = useState(false);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [finalMsg, setFinalMsg] = useState("");

  // === Timer effect ===
  useEffect(() => {
    let timer;
    if (running && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && running) {
      endRound();
    }
    return () => clearInterval(timer);
  }, [running, timeLeft]);

  // === Cambiar dimensión ===
  function switchDimension(dim) {
    setDimension(dim);
    setBankVerbs(
      Object.entries(DATA[dim]).flatMap(([lvl, verbs]) =>
        verbs.map((v) => ({ verb: v, level: +lvl }))
      )
    );
    setLevels({ 1: [], 2: [], 3: [], 4: [] });
  }

  // === Validación de drop ===
  function handleDrop(level, verb, target = "level") {
    const card =
      bankVerbs.find((v) => v.verb === verb) ||
      Object.values(levels)
        .flat()
        .find((v) => v.verb === verb);

    if (!card) return;

    if (target === "bank") {
      // 🔄 devolver al banco
      setBankVerbs((prev) => [...prev, card]);
      setLevels((prev) => {
        const copy = { ...prev };
        for (let i = 1; i <= 4; i++) {
          copy[i] = copy[i].filter((v) => v.verb !== verb);
        }
        return copy;
      });
      return;
    }

    // ✅ correcto
    if (card.level === level) {
      setLevels((prev) => ({
        ...prev,
        [level]: [...prev[level], card],
      }));
      setBankVerbs((prev) => prev.filter((v) => v.verb !== verb));
      addPoints(10);
      ding();
      checkWin([...bankVerbs.filter((v) => v.verb !== verb)]);
    } else {
      // ❌ incorrecto
      buzz();
      addPoints(-5);
      nextTeam();
    }
  }

  // === Equipos ===
  function addPoints(points) {
    setTeams((prev) => {
      const copy = [...prev];
      copy[activeTeam].score += points;
      return copy;
    });
  }

  function nextTeam() {
    setActiveTeam((prev) => (prev + 1) % teams.length);
  }

  // === Fin de ronda ===
  function checkWin(remaining) {
    if (remaining.length === 0) {
      endRound();
    }
  }

  function endRound() {
    setRunning(false);
    const maxScore = Math.max(...teams.map((t) => t.score));
    const winners = teams.filter((t) => t.score === maxScore);

    let summary = teams.map((t) => `${t.name}: ${t.score} pts`).join(" · ");
    if (winners.length === 1) {
      summary += ` | 🏆 Ganador: ${winners[0].name}`;
    } else {
      summary += " | 🤝 ¡Empate!";
    }

    setFinalMsg(`Fin de la ronda. ${summary}`);
    setModalOpen(true);
  }

  // === Reinicio global ===
  function resetGame() {
    // verbos al banco
    setBankVerbs(
      Object.entries(DATA[dimension]).flatMap(([lvl, verbs]) =>
        verbs.map((v) => ({ verb: v, level: +lvl }))
      )
    );
    setLevels({ 1: [], 2: [], 3: [], 4: [] });

    // equipos
    setTeams((prev) => prev.map((t, i) => ({ ...t, score: 0 })));
    setActiveTeam(0);

    // timer
    setTimeLeft(300);
    setRunning(false);

    // modal
    setModalOpen(false);
    setFinalMsg("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100">
      {/* Header con botón reset */}
      <Header onReset={resetGame} />

      {/* Main */}
      <main className="p-6 grid gap-6 max-w-7xl mx-auto md:grid-cols-[2fr_1fr]">
        {/* Panel + Banco */}
        <div className="space-y-6">
          <Panel
            dimension={dimension}
            levels={levels}
            onDrop={handleDrop}
            onChangeDimension={switchDimension}
          />
          <Bank
            verbs={bankVerbs.map((v) => v.verb)}
            onDrop={(verb) => handleDrop(null, verb, "bank")}
          />
        </div>

        {/* Timer + Equipos */}
        <div className="space-y-6">
          <Timer
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            running={running}
            setRunning={setRunning}
          />
          <Teams
            teams={teams}
            activeTeam={activeTeam}
            setActiveTeam={setActiveTeam}
          />
        </div>
      </main>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        message={finalMsg}
      />
    </div>
  );
}

export default App;
