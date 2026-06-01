"use client";

import { useSyncExternalStore } from "react";
import { createStore } from "./base";

interface LayoutPrefs {
  moderation: {
    widgetOrder: string[];
    widgetSizes: Record<string, { w: number; h: number }>;
    hiddenWidgets: string[];
  };
}

const defaultLayout: LayoutPrefs = {
  moderation: {
    widgetOrder: ["preview", "chat", "queue", "actions", "blocked-terms"],
    widgetSizes: {
      preview: { w: 6, h: 4 },
      chat: { w: 6, h: 8 },
      queue: { w: 6, h: 4 },
      actions: { w: 6, h: 4 },
      "blocked-terms": { w: 12, h: 3 },
    },
    hiddenWidgets: [],
  },
};

const layoutStore = createStore<LayoutPrefs>("stream:v1:layout", defaultLayout);

export function useLayoutPrefs() {
  const state = useSyncExternalStore(layoutStore.subscribe, layoutStore.getSnapshot, () => defaultLayout);

  return {
    ...state,
    setModerationLayout: (updates: Partial<LayoutPrefs["moderation"]>) => {
      layoutStore.setState((prev) => ({
        ...prev,
        moderation: { ...prev.moderation, ...updates },
      }));
    },
    resetModerationLayout: () => {
      layoutStore.setState((prev) => ({
        ...prev,
        moderation: defaultLayout.moderation,
      }));
    },
  };
}
