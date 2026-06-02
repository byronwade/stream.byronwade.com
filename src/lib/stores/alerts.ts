"use client";

import { useSyncExternalStore } from "react";
import type { AlertSettings } from "@/lib/types";
import { createStore } from "./base";

const defaultAlerts: AlertSettings = {
  style: "hype",
  accent: "#4f8cff",
  message: "{name} just followed!",
  sound: true,
  goalLabel: "Follower goal",
  goalCurrent: 12400,
  goalTarget: 15000,
};

const alertsStore = createStore<AlertSettings>("stream:v1:alerts", defaultAlerts);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "stream:v1:alerts") alertsStore.hydrate();
  });
}

export function useAlerts() {
  const state = useSyncExternalStore(alertsStore.subscribe, alertsStore.getSnapshot, () => defaultAlerts);

  return {
    ...state,
    update: (updates: Partial<AlertSettings>) =>
      alertsStore.setState((prev) => ({ ...prev, ...updates })),
    reset: () => alertsStore.setState(defaultAlerts),
  };
}
