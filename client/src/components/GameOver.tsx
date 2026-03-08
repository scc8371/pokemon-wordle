import { PokemonData } from "../utils";
import { normalizeString, capitalize } from "../utils";
import Button from "./Button";

interface Props {
  won: boolean;
  active: PokemonData;
  onReturnMenu: () => void;
}

const GameOver = (props: Props) => {
  const winText = props.won ? "Nice one!" : "Maybe next time...";
  const pkmnText = `The Pokemon was ${capitalize(normalizeString(props.active.name.trim()))}`;

  return (
    <>
      <div className="panel" id="game">
        <div className="title">
          <h1 className="title-text">{winText}</h1>
          <h1 className="subtitle-text">{pkmnText}</h1>
          <h2></h2>
        </div>

        <img src={props.active.sprite} className="pkmn-img"></img>

        <Button link="" onclick={props.onReturnMenu}>
          Return to Menu
        </Button>
      </div>
    </>
  );
};

export default GameOver;
