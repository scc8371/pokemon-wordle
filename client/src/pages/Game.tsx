// Created by Sami Chamberlain
//Purpose: Logic for the 'Pokemon Wordle' demo.

import { useEffect, useRef, useState } from "react";
import { normalizeString } from "../utils";
import Button from "../components/Button";
import { useApplicationState } from "../Store";
import { useNavigate } from "react-router-dom";
import { AudioPlayback } from "../components/AudioPlayback";
import { PokemonImage } from "../components/PokemonImage";

const Game = () => {
  const [store, setStore] = useApplicationState();

  const [currHint, setCurrHint] = useState(1);

  const responseRef = useRef<HTMLInputElement>(null);

  const nav = useNavigate();

  //navigate back to menu if pokemon isn't loaded.
  useEffect(() => {
    if (!store.dailyPokemon.name.length) {
      nav("/pokemon-wordle/");
    }
  }, []);

  //navigate to game over screen if the current hint exceeds 5, which is the maximum allowed.
  useEffect(() => {
    if (currHint > 5) nav("/pokemon-wordle/game-over");
  }, [currHint]);

  const submitAnswer = () => {
    if (responseRef.current) {
      const guess = normalizeString(responseRef.current.value.trim());

      const pkmnName = normalizeString(store.dailyPokemon.name.trim());

      if (guess === pkmnName) {
        //win!
        setStore({ ...store, win: true, guesses: currHint });
        nav("/pokemon-wordle/game-over/");
      } else {
        responseRef.current.value = "";
        setCurrHint(currHint + 1);
      }
    }
  };

  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="panel">
        <div className="relative top-screen">
          <div className="absolute w-full h-full top-6.5 left-6.5">
            {/* Display classification of pokemon starting on the 2nd hint */}
            {
              <div className="absolute top-1.25 left-62.5 w-50">
                {currHint > 1 ? store.dailyPokemon.class : "??? Pokémon"}
              </div>
            }

            {/* Display Pokemon typing starting on the 3rd hint */}
            {currHint > 2 && (
              <div className="absolute flex flex-col gap-2 justify-center top-20 left-49.5">
                {store.dailyPokemon.types.map((t) => (
                  <img
                    src={`${import.meta.env.BASE_URL}types/${t}.png`}
                    className="scale-150"
                  />
                ))}
              </div>
            )}

            {/* Display Detailed info of pokemon starting on the 4th hint */}

            <div className="absolute top-8.75 left-66.25 w-50">
              {currHint > 3 ? store.dailyPokemon.pokedexentry : "???"}
            </div>

            {/* Display image of pokemon starting on 4th hint (blacked out at first...) */}
            <div className="w-37.5 h-37.5">
              <PokemonImage
                pokemon={store.dailyPokemon}
                reveal={currHint > 4}
              />
            </div>
          </div>
        </div>

        <div className="relative bottom-screen">
          <div className="absolute left-11 top-4">
            <AudioPlayback pokemon={store.dailyPokemon} />
          </div>

          <div className="absolute bottom-5 w-fit flex items-center justify-center px-10 gap-2">
            <input
              placeholder="Type pokemon name here!"
              className="w-50 h-8 px-2 bg-white  rounded-xl border-2 border-black text-center"
              name="pokemonInput"
              id="pokemonInput"
              maxLength={35}
              ref={responseRef}
              /* Allows the enter key to be pressed for quickly submitting answers */
              onKeyDown={(key) => {
                if (key.key == "Enter") {
                  submitAnswer();
                }
              }}
            />

            {/* Submission button */}
            <Button label="Guess!" onClick={submitAnswer} />

            {/* Hint # tracker */}
            <div className="title text-white font-bold">
              <h2 id="hint-notif">Hint #{currHint}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
