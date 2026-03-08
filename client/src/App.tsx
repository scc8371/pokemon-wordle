import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Menu from "./components/Menu";
import Game from "./components/Game";
import GameOver from "./components/GameOver";
import { PokemonData, State } from "./utils";

function App() {
  const [activePokemon, setActivePokemon] = useState<PokemonData>({
    name: "",
    cry: "",
    class: "",
    pokedexEntry: "",
    sprite: "",
    types: [],
    pokedexNum: -1,
  });
  const [state, setState] = useState<State>(State.MENU);

  const [isLoaded, setIsLoaded] = useState(false);

  const goToGame = () => setState(State.GAME);

  const goToMenu = () => {
    setState(State.MENU);
    setWon(false);
  };

  const onGameOver = (win: boolean) => {
    setState(State.OVER);
    setWon(win);
  };

  const [won, setWon] = useState(false);

  async function fetchPkmnInfo() {
    const res = await fetch(
      "https://games.samichamberlain.com/pokemon-wordle/api",
    );
    const data = (await res.json()) as PokemonData;

    setActivePokemon(data);
    setIsLoaded(true);
  }

  useEffect(() => {
    fetchPkmnInfo();
  }, []);

  return (
    <>
      {!isLoaded ? (
        <p>Loading....</p>
      ) : (
        <div>
          {state === State.MENU && <Menu onStart={goToGame}></Menu>}
          {state === State.GAME && (
            <Game active={activePokemon} onGameOver={onGameOver}></Game>
          )}
          {state === State.OVER && (
            <GameOver
              won={won}
              active={activePokemon}
              onReturnMenu={goToMenu}
            ></GameOver>
          )}
        </div>
      )}
    </>
  );
}

export default App;
