"use client";

import { useSyncExternalStore } from "react";
import { createStore } from "./base";

interface FollowState {
  creators: string[];
  streams: string[];
  categories: string[];
}

const defaultFollows: FollowState = { creators: [], streams: [], categories: [] };
const followStore = createStore<FollowState>("stream:v1:follows", defaultFollows);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "stream:v1:follows") followStore.hydrate();
  });
}

export function useFollows() {
  const state = useSyncExternalStore(followStore.subscribe, followStore.getSnapshot, () => defaultFollows);

  return {
    ...state,
    isFollowingCreator: (id: string) => state.creators.includes(id),
    isFollowingStream: (id: string) => state.streams.includes(id),
    isFollowingCategory: (slug: string) => state.categories.includes(slug),
    toggleCreator: (id: string) => {
      followStore.setState((prev) => ({
        ...prev,
        creators: prev.creators.includes(id)
          ? prev.creators.filter((c) => c !== id)
          : [...prev.creators, id],
      }));
    },
    toggleStream: (id: string) => {
      followStore.setState((prev) => ({
        ...prev,
        streams: prev.streams.includes(id)
          ? prev.streams.filter((s) => s !== id)
          : [...prev.streams, id],
      }));
    },
    toggleCategory: (slug: string) => {
      followStore.setState((prev) => ({
        ...prev,
        categories: prev.categories.includes(slug)
          ? prev.categories.filter((c) => c !== slug)
          : [...prev.categories, slug],
      }));
    },
  };
}
