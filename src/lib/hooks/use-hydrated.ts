"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Returns false during SSR/prerender and the first (hydration) render, then true.
 * Lets client-only, localStorage-backed UI defer rendering until after hydration
 * without calling setState inside an effect (avoids cascading-render lint rule).
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
