"use client";

import { useSyncExternalStore } from "react";
import type { ChatMode } from "@/lib/types";
import { createStore } from "./base";

interface WatchPrefs {
  progress: Record<string, number>;
  quality: string;
  chatMode: ChatMode;
  captionsEnabled: boolean;
  theaterMode: boolean;
  catchUpDismissed: Record<string, boolean>;
}

const defaultWatch: WatchPrefs = {
  progress: {},
  quality: "auto",
  chatMode: "live",
  captionsEnabled: false,
  theaterMode: false,
  catchUpDismissed: {},
};

const watchStore = createStore<WatchPrefs>("stream:v1:watch", defaultWatch);

export function useWatchPrefs() {
  const state = useSyncExternalStore(watchStore.subscribe, watchStore.getSnapshot, () => defaultWatch);

  return {
    ...state,
    setProgress: (streamId: string, seconds: number) => {
      watchStore.setState((prev) => ({
        ...prev,
        progress: { ...prev.progress, [streamId]: seconds },
      }));
    },
    setQuality: (quality: string) => watchStore.setState((prev) => ({ ...prev, quality })),
    setChatMode: (chatMode: ChatMode) => watchStore.setState((prev) => ({ ...prev, chatMode })),
    setCaptions: (captionsEnabled: boolean) =>
      watchStore.setState((prev) => ({ ...prev, captionsEnabled })),
    setTheaterMode: (theaterMode: boolean) =>
      watchStore.setState((prev) => ({ ...prev, theaterMode })),
    dismissCatchUp: (streamId: string) => {
      watchStore.setState((prev) => ({
        ...prev,
        catchUpDismissed: { ...prev.catchUpDismissed, [streamId]: true },
      }));
    },
  };
}
