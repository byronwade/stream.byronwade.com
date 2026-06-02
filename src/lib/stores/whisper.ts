"use client";

import { useSyncExternalStore } from "react";
import type { WhisperThread } from "@/lib/types";
import whispersSeed from "@/data/whispers.json";
import { createStore } from "./base";

const seed = whispersSeed as WhisperThread[];

const whisperStore = createStore<WhisperThread[]>("stream:v1:whispers", seed);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "stream:v1:whispers") whisperStore.hydrate();
  });
}

export function useWhispers() {
  const threads = useSyncExternalStore(whisperStore.subscribe, whisperStore.getSnapshot, () => seed);

  return {
    threads,
    threadById: (id: string) => threads.find((t) => t.id === id),
    sendMessage: (threadId: string, text: string) => {
      whisperStore.setState((prev) =>
        prev.map((t) =>
          t.id === threadId
            ? {
                ...t,
                messages: [
                  ...t.messages,
                  {
                    id: `wm_${Date.now()}`,
                    from: "you" as const,
                    text,
                    sentAt: new Date().toISOString(),
                  },
                ],
              }
            : t,
        ),
      );
    },
  };
}
