"use client";

import { useSyncExternalStore } from "react";
import type { SubTier, Subscription } from "@/lib/types";
import { createStore } from "./base";

const subscriptionStore = createStore<Subscription[]>("stream:v1:subscriptions", []);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "stream:v1:subscriptions") subscriptionStore.hydrate();
  });
}

export function useSubscriptions() {
  const subscriptions = useSyncExternalStore(
    subscriptionStore.subscribe,
    subscriptionStore.getSnapshot,
    () => [] as Subscription[],
  );

  const getSubscription = (creatorId: string) =>
    subscriptions.find((s) => s.creatorId === creatorId);

  return {
    subscriptions,
    getSubscription,
    isSubscribed: (creatorId: string) => subscriptions.some((s) => s.creatorId === creatorId),
    tierFor: (creatorId: string): SubTier | 0 => getSubscription(creatorId)?.tier ?? 0,
    subscribe: (creatorId: string, tier: SubTier) => {
      subscriptionStore.setState((prev) => {
        const without = prev.filter((s) => s.creatorId !== creatorId);
        return [{ creatorId, tier, since: new Date().toISOString() }, ...without];
      });
    },
    unsubscribe: (creatorId: string) => {
      subscriptionStore.setState((prev) => prev.filter((s) => s.creatorId !== creatorId));
    },
  };
}
