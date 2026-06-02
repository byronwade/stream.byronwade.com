"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { PanelType } from "@/lib/types";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface UIState {
  searchOpen: boolean;
  shortcutsOpen: boolean;
  toasts: Toast[];
}

const defaultUI: UIState = { searchOpen: false, shortcutsOpen: false, toasts: [] };
let uiState = defaultUI;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export function useUIStore() {
  const state = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => uiState,
    () => defaultUI,
  );

  const addToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = `toast_${Date.now()}`;
    uiState = { ...uiState, toasts: [...uiState.toasts, { id, message, type }] };
    notify();
    setTimeout(() => {
      uiState = { ...uiState, toasts: uiState.toasts.filter((t) => t.id !== id) };
      notify();
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    uiState = { ...uiState, toasts: uiState.toasts.filter((t) => t.id !== id) };
    notify();
  }, []);

  const setSearchOpen = useCallback((open: boolean) => {
    uiState = { ...uiState, searchOpen: open };
    notify();
  }, []);

  const setShortcutsOpen = useCallback((open: boolean) => {
    uiState = { ...uiState, shortcutsOpen: open };
    notify();
  }, []);

  return { ...state, addToast, dismissToast, setSearchOpen, setShortcutsOpen };
}

export function usePanelState() {
  // Panel state is URL-driven; this hook is a convenience wrapper used in client components
  return { panelTypes: ["catch-up", "clip", "report", "creator", "filter", "analytics"] as PanelType[] };
}
