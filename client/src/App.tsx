import "./App.css";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppInit } from "./AppInit";
import Menu from "./pages/Menu";
import Game from "./pages/Game";
import GameOver from "./pages/GameOver";

function App() {
  return (
    <>
      <BrowserRouter>
        <AppInit>
          <Routes>
            <Route path="/pokemon-wordle" element={<Menu />} />
            <Route path="/pokemon-wordle/game/" element={<Game />} />
            <Route path="/pokemon-wordle/game-over/" element={<GameOver />} />

            <Route
              path="/*"
              element={<Navigate to="/pokemon-wordle" replace />}
            />
          </Routes>
        </AppInit>
      </BrowserRouter>
    </>
  );
}

export default App;
