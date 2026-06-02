"use client";

import type { ThemeMode } from "@/lib/types";
import { useTheme } from "@/lib/stores/theme";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { cn } from "@/lib/utils/cn";

const OPTIONS: { value: ThemeMode; label: string; icon: string }[] = [
  { value: "light", label: "Light", icon: "☀" },
  { value: "dark", label: "Dark", icon: "☾" },
  { value: "system", label: "System", icon: "⌁" },
];

export function ThemeToggle({ size = "md" }: { size?: "sm" | "md" }) {
  const { mode, setMode } = useTheme();
  const mounted = useHydrated();

  return (
    <div
      className="inline-flex rounded-chip border border-border-subtle bg-bg-elevated p-0.5"
      role="radiogroup"
      aria-label="Theme"
    >
      {OPTIONS.map((opt) => {
        const active = mounted && mode === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setMode(opt.value)}
            className={cn(
              "focus-ring rounded-chip font-medium transition-colors",
              size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm",
              active ? "bg-accent-primary/20 text-accent-primary" : "text-text-secondary hover:text-text-primary",
            )}
          >
            <span aria-hidden className="mr-1">
              {opt.icon}
            </span>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
