//Author: Sami Chamberlain
//Purpose: Helper function for audio playback

import { useRef } from "react";
import { PokemonData } from "../utils";

export const AudioPlayback = (props: { pokemon: PokemonData }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  return (
    <div
      className="pokedex-audio hover:cursor-pointer"
      onClick={() => {
        audioRef?.current?.play();
      }}
    >
      <div className="pokedex-audio-design" />
      {/* Absolute positioning for this game -- for styling purposes. Not inline with DOM */}
      <div className="relative top-[-110px] left-[100px] text-white">
        Click to replay Pokemon Audio
      </div>
      <audio
        ref={audioRef}
        controls
        autoPlay
        title="Pokemon Cry"
        className="hidden"
      >
        <source src={props.pokemon.cry} type="audio/ogg" />
      </audio>
    </div>
  );
};
