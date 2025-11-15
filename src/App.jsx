import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TeamsGame from "./pages/TeamsGame";
// FUTURO: import SoloGame from "./pages/SoloGame";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/equipos" element={<TeamsGame />} />
        <Route path="/solo" element={<div>Modo individual próximamente</div>} />
      </Routes>
    </BrowserRouter>
  );
}
