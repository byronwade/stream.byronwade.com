"use client";

import { useSyncExternalStore } from "react";
import { createStore } from "./base";

export interface NotifyPrefs {
  live: boolean;
  clips: boolean;
  replies: boolean;
  follows: boolean;
}

export interface ViewerPrefs {
  notify: NotifyPrefs;
  autoplayNext: boolean;
  reducedData: boolean;
  miniPlayerOnLeave: boolean;
}

const defaultPrefs: ViewerPrefs = {
  notify: { live: true, clips: true, replies: true, follows: true },
  autoplayNext: true,
  reducedData: false,
  miniPlayerOnLeave: true,
};

const prefsStore = createStore<ViewerPrefs>("stream:v1:prefs", defaultPrefs);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "stream:v1:prefs") prefsStore.hydrate();
  });
}

export function useViewerPrefs() {
  const raw = useSyncExternalStore(prefsStore.subscribe, prefsStore.getSnapshot, () => defaultPrefs);
  const state: ViewerPrefs = {
    ...defaultPrefs,
    ...raw,
    notify: { ...defaultPrefs.notify, ...(raw.notify ?? {}) },
  };

  return {
    ...state,
    setNotify: (key: keyof NotifyPrefs, value: boolean) =>
      prefsStore.setState((prev) => ({
        ...defaultPrefs,
        ...prev,
        notify: { ...defaultPrefs.notify, ...(prev.notify ?? {}), [key]: value },
      })),
    setPref: <K extends keyof ViewerPrefs>(key: K, value: ViewerPrefs[K]) =>
      prefsStore.setState((prev) => ({ ...defaultPrefs, ...prev, [key]: value })),
  };
}
