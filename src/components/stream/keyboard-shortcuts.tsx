"use client";

import { BloomLayer } from "@/components/bloom/bloom-layer";

interface KeyboardShortcutsProps {
  open: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: "Space", action: "Play / pause video" },
  { key: "C", action: "Open clip composer" },
  { key: "Esc", action: "Close Bloom panel" },
  { key: "?", action: "Show this help" },
];

export function KeyboardShortcuts({ open, onClose }: KeyboardShortcutsProps) {
  return (
    <BloomLayer open={open} onClose={onClose} title="Keyboard shortcuts">
      <ul className="space-y-2">
        {SHORTCUTS.map((s) => (
          <li key={s.key} className="flex items-center justify-between gap-4 text-sm">
            <kbd className="rounded bg-bg-elevated px-2 py-1 font-mono text-xs">{s.key}</kbd>
            <span className="text-text-secondary">{s.action}</span>
          </li>
        ))}
      </ul>
    </BloomLayer>
  );
}
