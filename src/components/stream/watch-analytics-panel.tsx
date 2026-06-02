"use client";

import type { Stream } from "@/lib/types";
import { getAnalyticsByStreamId } from "@/lib/data";
import { formatViewerCount } from "@/lib/utils/format";

interface WatchAnalyticsPanelProps {
  stream: Stream;
  viewerCount: number;
  healthScore: number;
}

/** Lightweight, read-only health + retention snapshot for the watch page Bloom panel. */
export function WatchAnalyticsPanel({ stream, viewerCount, healthScore }: WatchAnalyticsPanelProps) {
  const snapshots = getAnalyticsByStreamId(stream.id);
  const latest = snapshots[snapshots.length - 1];
  const retention = latest?.retention ?? [100, 92, 85, 80, 76, 73, 70, 68, 66, 64];

  const metrics = [
    { label: "Watching now", value: formatViewerCount(viewerCount) },
    { label: "Peak viewers", value: formatViewerCount(stream.peakViewerCount) },
    { label: "Chat health", value: `${healthScore}/100` },
    { label: "Bitrate", value: `${(stream.health.bitrateKbps / 1000).toFixed(1)} Mbps` },
    { label: "Dropped frames", value: `${stream.health.droppedFramesPct}%` },
    { label: "New-viewer score", value: `${stream.health.newViewerFriendlyScore}/100` },
  ];

  return (
    <div className="space-y-5">
      <p className="text-sm text-text-secondary">
        Live health snapshot for this stream. Metrics are simulated for the demo.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {metrics.map((m) => (
          <div key={m.label} className="solid-surface">
            <p className="muted-label">{m.label}</p>
            <p className="mt-1 text-xl font-bold">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="solid-surface">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Retention curve</h3>
          <span className="text-xs uppercase tracking-wide text-text-tertiary capitalize">
            {stream.health.overall}
          </span>
        </div>
        <svg viewBox="0 0 200 60" className="mt-3 h-28 w-full" aria-label="Viewer retention curve">
          <polyline
            fill="none"
            stroke="var(--color-accent-primary)"
            strokeWidth="2"
            points={retention
              .map((v, i) => `${(i / (retention.length - 1)) * 200},${60 - (v / 100) * 55}`)
              .join(" ")}
          />
        </svg>
        <p className="mt-2 text-xs text-text-tertiary">
          {latest
            ? `Retention from ${retention[0]}% to ${retention[retention.length - 1]}% over the session.`
            : "No analytics snapshot recorded yet."}
        </p>
      </div>
    </div>
  );
}
