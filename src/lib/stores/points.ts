"use client";

import { useSyncExternalStore } from "react";
import { createStore } from "./base";

/** Maps a creatorId to the local user's mock channel-points balance. */
type PointsState = Record<string, number>;

const pointsStore = createStore<PointsState>("stream:v1:points", {});

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "stream:v1:points") pointsStore.hydrate();
  });
}

export function usePoints() {
  const balances = useSyncExternalStore(
    pointsStore.subscribe,
    pointsStore.getSnapshot,
    () => ({}) as PointsState,
  );

  return {
    balances,
    balanceFor: (creatorId: string) => balances[creatorId] ?? 0,
    accrue: (creatorId: string, amount: number) => {
      pointsStore.setState((prev) => ({
        ...prev,
        [creatorId]: (prev[creatorId] ?? 0) + amount,
      }));
    },
    /** Spend points; returns true if the balance covered the cost. */
    spend: (creatorId: string, amount: number) => {
      const current = pointsStore.getSnapshot()[creatorId] ?? 0;
      if (current < amount) return false;
      pointsStore.setState((prev) => ({ ...prev, [creatorId]: (prev[creatorId] ?? 0) - amount }));
      return true;
    },
  };
}
