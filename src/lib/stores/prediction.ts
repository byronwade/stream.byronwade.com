"use client";

import { useSyncExternalStore } from "react";
import { createStore } from "./base";

interface Bet {
  outcomeId: string;
  amount: number;
}

interface PredictionState {
  /** predictionId -> the local user's bet */
  bets: Record<string, Bet>;
  /** predictionId -> winning outcome id (locally simulated resolution) */
  resolved: Record<string, string>;
}

const defaultState: PredictionState = { bets: {}, resolved: {} };
const predictionStore = createStore<PredictionState>("stream:v1:predictions", defaultState);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "stream:v1:predictions") predictionStore.hydrate();
  });
}

export function usePredictions() {
  const state = useSyncExternalStore(
    predictionStore.subscribe,
    predictionStore.getSnapshot,
    () => defaultState,
  );

  return {
    bets: state.bets,
    resolved: state.resolved,
    betFor: (predictionId: string): Bet | undefined => state.bets[predictionId],
    resolvedOutcome: (predictionId: string): string | undefined => state.resolved[predictionId],
    placeBet: (predictionId: string, outcomeId: string, amount: number) => {
      predictionStore.setState((prev) => ({
        ...prev,
        bets: { ...prev.bets, [predictionId]: { outcomeId, amount } },
      }));
    },
    resolve: (predictionId: string, winningOutcomeId: string) => {
      predictionStore.setState((prev) => ({
        ...prev,
        resolved: { ...prev.resolved, [predictionId]: winningOutcomeId },
      }));
    },
  };
}
