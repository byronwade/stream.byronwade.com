"use client";

import { useEffect } from "react";
import { applyTheme, useTheme } from "@/lib/stores/theme";

/**
 * Applies the stored theme to <html data-theme> and keeps "system" in sync with the
 * OS preference. A no-flash inline script in layout.tsx sets the attribute before
 * paint; this provider keeps it correct as the stored mode or OS preference changes.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode } = useTheme();

  useEffect(() => {
    applyTheme(mode);
  }, [mode]);

  useEffect(() => {
    if (mode !== "system" || typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mode]);

  return <>{children}</>;
}
