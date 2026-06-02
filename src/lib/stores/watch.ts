"use client";

import { useSyncExternalStore } from "react";
import type { CaptionStyle, ChatMode } from "@/lib/types";
import { createStore } from "./base";

interface WatchPrefs {
  progress: Record<string, number>;
  quality: string;
  chatMode: ChatMode;
  captionsEnabled: boolean;
  theaterMode: boolean;
  catchUpDismissed: Record<string, boolean>;
  /** Accessibility: hide video and play audio-only with a visualizer placeholder. */
  audioOnly: boolean;
  /** Accessibility: caption appearance applied to native player cues. */
  captionStyle: CaptionStyle;
}

const defaultCaptionStyle: CaptionStyle = { size: "md", background: "semi" };

const defaultWatch: WatchPrefs = {
  progress: {},
  quality: "auto",
  chatMode: "live",
  captionsEnabled: false,
  theaterMode: false,
  catchUpDismissed: {},
  audioOnly: false,
  captionStyle: defaultCaptionStyle,
};

const watchStore = createStore<WatchPrefs>("stream:v1:watch", defaultWatch);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "stream:v1:watch") watchStore.hydrate();
  });
}

export function useWatchPrefs() {
  const raw = useSyncExternalStore(watchStore.subscribe, watchStore.getSnapshot, () => defaultWatch);
  // Tolerate older persisted shapes that predate the accessibility fields.
  const state = {
    ...raw,
    audioOnly: raw.audioOnly ?? false,
    captionStyle: raw.captionStyle ?? defaultCaptionStyle,
  };

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
    setAudioOnly: (audioOnly: boolean) => watchStore.setState((prev) => ({ ...prev, audioOnly })),
    setCaptionStyle: (updates: Partial<CaptionStyle>) =>
      watchStore.setState((prev) => ({
        ...prev,
        captionStyle: { ...(prev.captionStyle ?? defaultCaptionStyle), ...updates },
      })),
    dismissCatchUp: (streamId: string) => {
      watchStore.setState((prev) => ({
        ...prev,
        catchUpDismissed: { ...prev.catchUpDismissed, [streamId]: true },
      }));
    },
  };
}
