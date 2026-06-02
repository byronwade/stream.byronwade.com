"use client";

import type { Stream } from "@/lib/types";
import { resolveCatchUpMoments, shouldShowJoinLate, getJoinLateHeadline } from "@/lib/utils/catch-up";
import { formatDuration } from "@/lib/utils/format";

interface CatchMeUpPanelProps {
  stream: Stream;
  currentTime: number;
  /** Jump the player to a timestamp (seconds). When provided, moments/timeline become seek buttons. */
  onSeek?: (seconds: number) => void;
}

export function CatchMeUpPanel({ stream, currentTime, onSeek }: CatchMeUpPanelProps) {
  const { moments, timelineEvents } = resolveCatchUpMoments(stream, currentTime);
  const showJoinLate = shouldShowJoinLate(stream);
  const headline = showJoinLate ? getJoinLateHeadline(stream) : stream.catchUp.headline;

  return (
    <div className="space-y-4">
      {showJoinLate && (
        <div className="rounded-xl border border-accent-primary/30 bg-accent-primary/10 p-4">
          <p className="font-semibold text-accent-primary">Join Late</p>
          <p className="mt-1 text-sm text-text-secondary">{headline}</p>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold">{headline || "Catch Me Up"}</h3>
        <p className="mt-1 text-sm text-text-secondary">{stream.catchUp.currentTopic}</p>
        <p className="mt-2 text-sm">{stream.catchUp.summary}</p>
      </div>

      {moments.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-text-secondary">Recent moments</h4>
          <ul className="space-y-3">
            {moments.map((m) =>
              onSeek ? (
                <li key={m.atSecond}>
                  <button
                    type="button"
                    onClick={() => onSeek(m.atSecond)}
                    className="solid-surface focus-ring block w-full text-left transition-colors hover:border-accent-primary/30"
                  >
                    <div className="flex items-center gap-2 text-xs text-accent-primary">
                      <span aria-hidden>▸</span>
                      {formatDuration(m.atSecond)}
                      <span className="font-semibold">{m.label}</span>
                    </div>
                    <p className="mt-1 text-sm text-text-secondary">{m.summary}</p>
                  </button>
                </li>
              ) : (
                <li key={m.atSecond} className="solid-surface">
                  <div className="flex items-center gap-2 text-xs text-accent-primary">
                    {formatDuration(m.atSecond)}
                    <span className="font-semibold">{m.label}</span>
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">{m.summary}</p>
                </li>
              ),
            )}
          </ul>
        </div>
      )}

      {timelineEvents.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-text-secondary">Timeline</h4>
          <ul className="space-y-2">
            {timelineEvents.map((e) =>
              onSeek ? (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => onSeek(e.atSecond)}
                    className="focus-ring flex w-full gap-3 rounded-lg p-1 text-left text-sm hover:bg-white/5"
                  >
                    <span className="shrink-0 text-accent-primary">{formatDuration(e.atSecond)}</span>
                    <div>
                      <span className="font-medium">{e.title}</span>
                      <p className="text-text-secondary">{e.summary}</p>
                    </div>
                  </button>
                </li>
              ) : (
                <li key={e.id} className="flex gap-3 text-sm">
                  <span className="shrink-0 text-text-tertiary">{formatDuration(e.atSecond)}</span>
                  <div>
                    <span className="font-medium">{e.title}</span>
                    <p className="text-text-secondary">{e.summary}</p>
                  </div>
                </li>
              ),
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
