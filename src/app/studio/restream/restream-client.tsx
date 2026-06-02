"use client";

import { useState } from "react";
import { useRestream } from "@/lib/stores/restream";
import { useUIStore } from "@/lib/stores/ui";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils/cn";

export function RestreamClient() {
  const { targets, toggle, regenerateKey } = useRestream();
  const { addToast } = useUIStore();
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const enabledCount = targets.filter((t) => t.enabled).length;

  return (
    <div className="section-shell py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Restream targets</h1>
        <p className="text-sm text-text-tertiary">
          Mirror your stream to multiple destinations. These are mock destinations with fake keys —
          nothing is broadcast anywhere.
        </p>
      </div>

      <div className="mb-4 rounded-card border border-warning/30 bg-warning/10 p-3 text-sm text-text-secondary">
        Demo only — stream keys below are placeholders and clearly fake. {enabledCount} of{" "}
        {targets.length} destinations enabled.
      </div>

      <ul className="space-y-3">
        {targets.map((t) => {
          const show = revealed[t.id];
          return (
            <li key={t.id} className="solid-surface">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold",
                      t.enabled ? "bg-accent-primary/20 text-accent-primary" : "bg-bg-elevated-2 text-text-tertiary",
                    )}
                    aria-hidden
                  >
                    {t.platform.slice(0, 1)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{t.platform}</p>
                    <p className="text-xs text-text-tertiary">
                      {t.enabled ? "Mirroring (mock)" : "Disabled"}
                    </p>
                  </div>
                </div>
                <Toggle label={`Enable ${t.platform}`} checked={t.enabled} onChange={() => toggle(t.id)} />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <code className="flex-1 truncate rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2 font-mono text-xs text-text-secondary">
                  {show ? t.streamKey : "•".repeat(Math.min(24, t.streamKey.length))}
                </code>
                <button
                  type="button"
                  onClick={() => setRevealed((r) => ({ ...r, [t.id]: !r[t.id] }))}
                  className="btn-secondary text-xs"
                >
                  {show ? "Hide" : "Reveal"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(t.streamKey).catch(() => {});
                    addToast("Copied fake key to clipboard");
                  }}
                  className="btn-secondary text-xs"
                >
                  Copy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    regenerateKey(t.id);
                    addToast(`Regenerated ${t.platform} key (mock)`);
                  }}
                  className="btn-secondary text-xs"
                >
                  Regenerate
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
