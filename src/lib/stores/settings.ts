"use client";

import { useSyncExternalStore } from "react";
import { createStore } from "./base";

export interface StudioSettings {
  channelName: string;
  bio: string;
  autoFeatureClips: boolean;
  holdReportedMessages: boolean;
  sceneNotes: string;
}

const defaultSettings: StudioSettings = {
  channelName: "Demo Creator",
  bio: "Creative builder streaming cozy city design.",
  autoFeatureClips: true,
  holdReportedMessages: true,
  sceneNotes: "",
};

const settingsStore = createStore<StudioSettings>("stream:v1:settings", defaultSettings);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "stream:v1:settings") settingsStore.hydrate();
  });
}

export function useStudioSettings() {
  const state = useSyncExternalStore(
    settingsStore.subscribe,
    settingsStore.getSnapshot,
    () => defaultSettings,
  );

  return {
    ...state,
    updateSettings: (updates: Partial<StudioSettings>) => {
      settingsStore.setState((prev) => ({ ...prev, ...updates }));
    },
    resetSettings: () => settingsStore.setState(defaultSettings),
  };
}
