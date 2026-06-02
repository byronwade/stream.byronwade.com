"use client";

import { useSyncExternalStore } from "react";
import type { RestreamTarget } from "@/lib/types";
import { createStore } from "./base";

const defaultTargets: RestreamTarget[] = [
  { id: "rs_twitch", platform: "Twitch", enabled: true, streamKey: "live_demo_xxxx-twitch-FAKE" },
  { id: "rs_youtube", platform: "YouTube", enabled: true, streamKey: "yt-demo-xxxx-FAKE" },
  { id: "rs_kick", platform: "Kick", enabled: false, streamKey: "kick-demo-xxxx-FAKE" },
  { id: "rs_x", platform: "X", enabled: false, streamKey: "x-demo-xxxx-FAKE" },
];

const restreamStore = createStore<RestreamTarget[]>("stream:v1:restream", defaultTargets);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "stream:v1:restream") restreamStore.hydrate();
  });
}

export function useRestream() {
  const targets = useSyncExternalStore(
    restreamStore.subscribe,
    restreamStore.getSnapshot,
    () => defaultTargets,
  );

  return {
    targets,
    toggle: (id: string) => {
      restreamStore.setState((prev) =>
        prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)),
      );
    },
    regenerateKey: (id: string) => {
      restreamStore.setState((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, streamKey: `${t.platform.toLowerCase()}-demo-${Math.random().toString(36).slice(2, 8)}-FAKE` }
            : t,
        ),
      );
    },
  };
}
