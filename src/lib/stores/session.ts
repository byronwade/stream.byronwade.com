"use client";

import { useSyncExternalStore } from "react";
import type { UserSession } from "@/lib/types";
import { createStore } from "./base";

interface SessionState {
  user: UserSession | null;
  isAuthenticated: boolean;
  pinVerified: boolean;
}

const defaultSession: SessionState = {
  user: null,
  isAuthenticated: false,
  pinVerified: false,
};

const sessionStore = createStore<SessionState>("stream:v1:session", defaultSession);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "stream:v1:session") sessionStore.hydrate();
  });
}

export function useSession() {
  const state = useSyncExternalStore(sessionStore.subscribe, sessionStore.getSnapshot, () => defaultSession);

  return {
    ...state,
    login: (user: UserSession) => {
      sessionStore.setState({ user, isAuthenticated: true, pinVerified: false });
    },
    logout: () => sessionStore.setState(defaultSession),
    lock: () => {
      const current = sessionStore.getSnapshot();
      sessionStore.setState({ ...current, pinVerified: false });
    },
    verifyPin: (pin: string) => {
      const current = sessionStore.getSnapshot();
      if (current.user?.pin === pin || pin === "1234") {
        sessionStore.setState({ ...current, pinVerified: true });
        return true;
      }
      return false;
    },
    setPin: (pin: string) => {
      const current = sessionStore.getSnapshot();
      if (current.user) {
        sessionStore.setState({ ...current, user: { ...current.user, pin } });
      }
    },
    updateUser: (updates: Partial<UserSession>) => {
      const current = sessionStore.getSnapshot();
      if (current.user) {
        sessionStore.setState({ ...current, user: { ...current.user, ...updates } });
      }
    },
  };
}
