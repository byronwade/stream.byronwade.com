"use client";

import { useSyncExternalStore } from "react";
import type { ThemeMode } from "@/lib/types";
import { createStore } from "./base";

interface ThemeState {
  mode: ThemeMode;
}

const defaultTheme: ThemeState = { mode: "system" };
const themeStore = createStore<ThemeState>("stream:v1:theme", defaultTheme);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "stream:v1:theme") themeStore.hydrate();
  });
}

/** Resolve a stored mode to a concrete light/dark value using the OS preference. */
export function resolveTheme(mode: ThemeMode): "light" | "dark" {
  if (mode === "system") {
    if (typeof window === "undefined") return "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return mode;
}

export function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", resolveTheme(mode));
}

export function useTheme() {
  const state = useSyncExternalStore(themeStore.subscribe, themeStore.getSnapshot, () => defaultTheme);

  return {
    mode: state.mode,
    resolved: resolveTheme(state.mode),
    setMode: (mode: ThemeMode) => {
      themeStore.setState({ mode });
      applyTheme(mode);
    },
  };
}
