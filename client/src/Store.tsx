import { PokemonData } from "./utils";
import { createContext, ReactNode, useContext, useState } from "react";

export interface ApplicationState {
  dailyPokemon: PokemonData;
  user: {
    id: number;
    image: string;
  };

  permissions: string[];
  win: boolean;
  guesses: number;
}

export const ApplicationContext = createContext<
  [ApplicationState, (state: ApplicationState) => void]
>([{} as ApplicationState, () => null]);

export const useApplicationState = () => useContext(ApplicationContext);

export const ApplicationState = (props: { children: ReactNode }) => {
  const [state, setState] = useState<ApplicationState>({
    dailyPokemon: {
      name: "",
      cry: "",
      class: "",
      sprite: "",
      pokedexnum: 0,
      types: [],
      pokedexentry: "",
    },
    user: {
      id: -1,
      image: "",
    },
    permissions: [],
    win: false,
    guesses: 0,
  });

  return (
    <ApplicationContext.Provider value={[state, setState]}>
      {props.children}
    </ApplicationContext.Provider>
  );
};
