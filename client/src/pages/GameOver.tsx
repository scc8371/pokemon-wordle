//Author: Sami Chamberlain
//Purpose: Holds all logic for the Menu state of PokeWordle

import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useApplicationState } from "../Store";
import { useEffect } from "react";

const GameOver = () => {
  const [store, setStore] = useApplicationState();
  const nav = useNavigate();

  //navigate back to menu if pokemon isn't loaded.
  useEffect(() => {
    if (!store.dailyPokemon.name.length) nav("/pokemon-wordle/");
  }, []);

  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="panel" id="game">
        {/* Pokemon Sprite Header */}
        <div className=" flex justify-center relative top-screen-reveal">
          <img className=" w-75" src={store.dailyPokemon.sprite}></img>
        </div>

        {/* Notification to user if they got it right */}
        <div
          className="relative text-center flex items-center
          justify-center flex-col gap-5 bottom-screen text-white text-[20pt] border-black"
        >
          <div className="relative -top-2.5">
            {store.win ? (
              <div className="flex flex-col">
                You got it!{" "}
                <span className="text-[15pt]">
                  Guessed in {store.guesses} attempt(s).
                </span>
              </div>
            ) : (
              "Better luck next time..."
            )}{" "}
            <div>The Pokémon of the day is {store.dailyPokemon.name}!</div>
          </div>

          {/* Button to return to menu / reset state for next game... */}
          <Button
            label="Return to Menu."
            onClick={() => {
              nav("/pokemon-wordle/");
              setStore({ ...store, win: false, guesses: 0 });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default GameOver;
