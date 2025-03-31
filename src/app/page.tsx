"use client";
import { useContext } from "react";

import Crossword from "@/components/crossword/crossword";
import GirlfriendLandingPage from "@/components/landing-page/landingPage";
import Letter from "@/components/letter/letter";
import { StateContext, StateProvider } from "@/components/states";

export default function Home() {
  return (
    <div className="bg-pink-100">
      <StateProvider>
        <StatePicker />
      </StateProvider>
    </div>
  );
}

function StatePicker() {
  const { state } = useContext(StateContext);

  if (!state) {
    return null;
  }

  if (state === "home") {
    return <GirlfriendLandingPage />;
  }

  if (state === "crossword") {
    return <Crossword />;
  }

  if (state === "letter") {
    return <Letter />;
  }

  return <div>Unknown state: {state}</div>;
}
