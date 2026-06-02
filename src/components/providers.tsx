"use client";

import { AppShell } from "@/components/shell/app-shell";
import { ThemeProvider } from "@/components/shell/theme-provider";
import { MiniPlayerProvider } from "@/components/stream/mini-player";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MiniPlayerProvider>
        <AppShell>{children}</AppShell>
      </MiniPlayerProvider>
    </ThemeProvider>
  );
}
