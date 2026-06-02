"use client";

import { useState } from "react";
import type { Emote, SubTier } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

interface EmotePickerProps {
  emotes: Emote[];
  /** The viewer's sub tier for this channel (0 = not subscribed). */
  viewerTier: SubTier | 0;
  onPick: (code: string) => void;
}

export function EmotePicker({ emotes, viewerTier, onPick }: EmotePickerProps) {
  const [open, setOpen] = useState(false);

  const isLocked = (e: Emote) => Boolean(e.tier) && (e.tier as number) > (viewerTier as number);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="focus-ring rounded-lg border border-border-subtle px-2.5 py-2 text-sm hover:bg-white/5"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Emote picker"
      >
        <span aria-hidden>😊</span>
      </button>
      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-label="Emotes"
            className="absolute bottom-12 right-0 z-50 w-64 rounded-card border border-border-subtle bg-bg-elevated p-3 shadow-panel"
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-tertiary">Emotes</p>
            <div className="grid grid-cols-6 gap-1">
              {emotes.map((e) => {
                const locked = isLocked(e);
                return (
                  <button
                    key={e.code}
                    type="button"
                    disabled={locked}
                    title={locked ? `${e.label} · Tier ${e.tier} sub` : e.label}
                    onClick={() => {
                      onPick(e.code);
                      setOpen(false);
                    }}
                    className={cn(
                      "focus-ring relative flex h-9 items-center justify-center rounded-lg text-lg hover:bg-bg-elevated-2",
                      locked && "cursor-not-allowed opacity-40",
                    )}
                  >
                    <span aria-hidden>{e.char}</span>
                    {locked && <span className="absolute -bottom-0.5 -right-0.5 text-[9px]">🔒</span>}
                  </button>
                );
              })}
            </div>
            {viewerTier === 0 && (
              <p className="mt-2 text-[11px] text-text-tertiary">Subscribe to unlock channel emotes.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
