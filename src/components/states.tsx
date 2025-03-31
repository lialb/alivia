"use client";

import { createContext, useState } from "react";

export type State = "home" | "crossword" | "letter";

type StateContextType = {
  state: State | null;
  setState: (state: State) => void;
};

export const StateContext = createContext<StateContextType>({
  state: "home",
  setState: () => {},
});

export const StateProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<State>("home");

  return (
    <StateContext.Provider value={{ state, setState }}>
      {children}
    </StateContext.Provider>
  );
};
