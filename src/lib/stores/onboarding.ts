"use client";

import { useSyncExternalStore } from "react";
import { createStore } from "./base";

interface OnboardingState {
  done: boolean;
}

const defaultState: OnboardingState = { done: false };
const onboardingStore = createStore<OnboardingState>("stream:v1:onboarded", defaultState);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "stream:v1:onboarded") onboardingStore.hydrate();
  });
}

export function useOnboarding() {
  const state = useSyncExternalStore(
    onboardingStore.subscribe,
    onboardingStore.getSnapshot,
    () => defaultState,
  );

  return {
    done: state.done,
    complete: () => onboardingStore.setState({ done: true }),
    restart: () => onboardingStore.setState({ done: false }),
  };
}
