import { ReactNode, useEffect, useState } from "react";
import { Template } from "./Template";
import { PokemonData } from "./utils";
import { useApplicationState } from "./Store";
import Spinner from "./Spinner";

export const AppInit = (props: { children?: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [state, setState] = useApplicationState();

  async function fetchPkmnInfo() {
    const res = await fetch(
      "https://games.samichamberlain.com/pokemon-wordle/api/pokemon-of-day",
    );
    const data = (await res.json()) as PokemonData;

    return data;
  }

  const init = async () => {
    setLoading(false);

    const activePkmn = await fetchPkmnInfo();

    setState({ ...state, dailyPokemon: activePkmn });
    setLoading(false);
  };

  //init application state on load...
  useEffect(() => {
    init();
  }, []);

  return (
    <Template>
      {loading ? (
        <Spinner />
      ) : (
        <div className="w-full h-full md:scale-150 scale-75">
          {props.children}
        </div>
      )}
    </Template>
  );
};
