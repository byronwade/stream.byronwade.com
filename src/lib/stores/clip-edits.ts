"use client";

import { useSyncExternalStore } from "react";
import { createStore } from "./base";

interface ClipEditsState {
  /** Clip id -> overridden title. */
  titles: Record<string, string>;
  /** Clip id chosen to be featured on the channel. */
  featuredId: string | null;
}

const defaultEdits: ClipEditsState = { titles: {}, featuredId: null };
const clipEditsStore = createStore<ClipEditsState>("stream:v1:clip-edits", defaultEdits);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "stream:v1:clip-edits") clipEditsStore.hydrate();
  });
}

export function useClipEdits() {
  const state = useSyncExternalStore(clipEditsStore.subscribe, clipEditsStore.getSnapshot, () => defaultEdits);

  return {
    titles: state.titles ?? {},
    featuredId: state.featuredId ?? null,
    titleFor: (id: string, fallback: string) => state.titles?.[id] ?? fallback,
    setTitle: (id: string, title: string) => {
      clipEditsStore.setState((prev) => ({ ...prev, titles: { ...prev.titles, [id]: title } }));
    },
    setFeatured: (id: string | null) => {
      clipEditsStore.setState((prev) => ({ ...prev, featuredId: id }));
    },
  };
}
