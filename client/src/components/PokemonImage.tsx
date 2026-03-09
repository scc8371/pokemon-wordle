//Author: Sami Chamberlain
//Purpose: Displays Pokemon Image on simulated PokeDEX. Hidden at first.

import classNames from "classnames";
import { PokemonData } from "../utils";

export const PokemonImage = (props: {
  pokemon: PokemonData;
  reveal: boolean;
}) => {
  return (
    <img
      className={classNames("!w-[150px] !h-[150px]", {
        "brightness-0": props.reveal,
      })}
      src={
        props.reveal
          ? props.pokemon.sprite
          : `${import.meta.env.BASE_URL}pokemon/placeholder.png`
      }
    />
  );
};
