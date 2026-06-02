"use client";

import { StreamCard } from "@/components/stream/stream-card";
import { useHistory } from "@/lib/stores/history";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { getStreamById } from "@/lib/data";
import type { Stream } from "@/lib/types";

/**
 * "Continue watching" rail sourced from the local watch-history store. Renders
 * nothing until hydrated (and only when there is history) to avoid SSR mismatch.
 */
export function ContinueWatchingRail({ className }: { className?: string }) {
  const { streams: history, clear } = useHistory();
  const hydrated = useHydrated();

  if (!hydrated) return null;

  const streams = history
    .map((e) => getStreamById(e.id))
    .filter((s): s is Stream => Boolean(s))
    .slice(0, 6);

  if (streams.length === 0) return null;

  return (
    <section className={className}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Continue watching</h2>
        <button
          type="button"
          onClick={clear}
          className="focus-ring rounded text-sm text-text-tertiary hover:text-text-secondary"
        >
          Clear history
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {streams.map((s) => (
          <StreamCard key={s.id} stream={s} density="compact" />
        ))}
      </div>
    </section>
  );
}
