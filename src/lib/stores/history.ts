"use client";

import { useSyncExternalStore } from "react";
import { createStore } from "./base";

export interface HistoryEntry {
  id: string;
  slug: string;
  kind: "stream" | "clip";
  at: string;
  positionSeconds?: number;
}

const historyStore = createStore<HistoryEntry[]>("stream:v1:history", []);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "stream:v1:history") historyStore.hydrate();
  });
}

function record(entry: Omit<HistoryEntry, "at">) {
  historyStore.setState((prev) => {
    const without = prev.filter((e) => !(e.kind === entry.kind && e.id === entry.id));
    return [{ ...entry, at: new Date().toISOString() }, ...without].slice(0, 50);
  });
}

export const recordHistory = record;

export function useHistory() {
  const entries = useSyncExternalStore(historyStore.subscribe, historyStore.getSnapshot, () => []);

  return {
    entries,
    streams: entries.filter((e) => e.kind === "stream"),
    clips: entries.filter((e) => e.kind === "clip"),
    record,
    remove: (kind: HistoryEntry["kind"], id: string) => {
      historyStore.setState((prev) => prev.filter((e) => !(e.kind === kind && e.id === id)));
    },
    clear: () => historyStore.setState([]),
  };
}
