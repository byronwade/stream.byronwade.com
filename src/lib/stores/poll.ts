"use client";

import { useSyncExternalStore } from "react";
import { createStore } from "./base";

/** Maps a poll id to the option id the local user voted for. */
type PollVotes = Record<string, string>;

const pollStore = createStore<PollVotes>("stream:v1:polls", {});

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "stream:v1:polls") pollStore.hydrate();
  });
}

export function usePollVotes() {
  const votes = useSyncExternalStore(pollStore.subscribe, pollStore.getSnapshot, () => ({}) as PollVotes);

  return {
    votes,
    votedOption: (pollId: string): string | undefined => votes[pollId],
    vote: (pollId: string, optionId: string) => {
      pollStore.setState((prev) => ({ ...prev, [pollId]: optionId }));
    },
  };
}
