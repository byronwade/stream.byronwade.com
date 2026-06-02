"use client";

import { useEffect } from "react";
import { BloomLayer } from "@/components/bloom/bloom-layer";
import { useUIStore } from "@/lib/stores/ui";

const GROUPS: { heading: string; items: { key: string; action: string }[] }[] = [
  {
    heading: "Global",
    items: [
      { key: "?", action: "Show this help" },
      { key: "/", action: "Open search" },
      { key: "Esc", action: "Close panel / overlay" },
    ],
  },
  {
    heading: "Watch page",
    items: [
      { key: "Space", action: "Play / pause video" },
      { key: "C", action: "Open clip composer" },
      { key: "M", action: "Mute / unmute" },
      { key: "T", action: "Theater mode" },
    ],
  },
];

/**
 * App-wide keyboard shortcut cheat sheet. Listens for `?` (when not typing) and
 * `/` to open search, and is also opened via the UI store from any "Shortcuts"
 * button. Rendered once in the app shell.
 */
export function ShortcutsOverlay() {
  const { shortcutsOpen, setShortcutsOpen, setSearchOpen } = useUIStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      if (e.key === "?") {
        e.preventDefault();
        setShortcutsOpen(true);
      } else if (e.key === "/") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setShortcutsOpen, setSearchOpen]);

  return (
    <BloomLayer open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} title="Keyboard shortcuts">
      <div className="space-y-5">
        {GROUPS.map((group) => (
          <div key={group.heading}>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
              {group.heading}
            </h3>
            <ul className="space-y-2">
              {group.items.map((s) => (
                <li key={s.key} className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-text-secondary">{s.action}</span>
                  <kbd className="rounded bg-bg-elevated px-2 py-1 font-mono text-xs">{s.key}</kbd>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </BloomLayer>
  );
}
