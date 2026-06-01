"use client";

import { useSyncExternalStore } from "react";
import type { Clip } from "@/lib/types";
import { createStore } from "./base";

const clipStore = createStore<Clip[]>("stream:v1:clips", []);

export function useClips() {
  const clips = useSyncExternalStore(clipStore.subscribe, clipStore.getSnapshot, () => []);

  return {
    clips,
    addClip: (clip: Clip) => clipStore.setState((prev) => [clip, ...prev]),
    removeClip: (id: string) => clipStore.setState((prev) => prev.filter((c) => c.id !== id)),
    getClip: (id: string) => clips.find((c) => c.id === id),
  };
}
