"use client";

import { useState } from "react";
import { AnalyticsCard } from "@/components/studio/analytics-card";
import { getAnalyticsByStreamId, getStreamsWithAnalytics } from "@/lib/data";
import { useAnalyticsSimulator } from "@/lib/mock/simulators";
import { cn } from "@/lib/utils/cn";
import type { Stream } from "@/lib/types";

function AnalyticsView({ stream }: { stream: Stream }) {
  const snapshots = getAnalyticsByStreamId(stream.id);
  const latest = snapshots[snapshots.length - 1];
  const retention = useAnalyticsSimulator(latest?.retention ?? [100, 90, 80, 70], true);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnalyticsCard label="Current viewers" value={stream.viewerCount} chartData={retention} />
        <AnalyticsCard label="Avg watch time" value={`${Math.round((latest?.avgWatchTime ?? 0) / 60)}m`} />
        <AnalyticsCard label="Follows gained" value={latest?.followsGained ?? 0} />
        <AnalyticsCard label="Clips created" value={latest?.clipsCreated ?? 0} />
        <AnalyticsCard label="Chat health" value={stream.health.chatHealthScore} />
        <AnalyticsCard label="New viewer score" value={stream.health.newViewerFriendlyScore} />
      </div>

      <div className="mt-8 solid-surface">
        <h3 className="font-semibold">Retention curve</h3>
        <svg viewBox="0 0 200 60" className="mt-4 h-32 w-full" aria-label={`Retention chart for ${stream.title}`}>
          <polyline
            fill="none"
            stroke="var(--color-accent-primary)"
            strokeWidth="2"
            points={retention
              .map((v, i) => `${(i / (retention.length - 1)) * 200},${60 - (v / 100) * 55}`)
              .join(" ")}
          />
        </svg>
      </div>
    </>
  );
}

export default function StudioAnalyticsPage() {
  const streams = getStreamsWithAnalytics();
  const [selectedId, setSelectedId] = useState(streams[0]?.id);
  const stream = streams.find((s) => s.id === selectedId) ?? streams[0];

  return (
    <div className="section-shell py-8">
      <h2 className="mb-2 text-xl font-bold">Analytics</h2>
      <p className="mb-6 text-sm text-text-secondary">
        Simulated retention and engagement snapshots. Pick a stream to inspect.
      </p>

      {streams.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Select stream">
          {streams.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={s.id === stream?.id}
              onClick={() => setSelectedId(s.id)}
              className={cn(s.id === stream?.id ? "pill-nav-active" : "pill-nav focus-ring", "text-xs")}
            >
              {s.title}
            </button>
          ))}
        </div>
      )}

      {stream ? (
        <AnalyticsView key={stream.id} stream={stream} />
      ) : (
        <p className="text-text-secondary">No analytics snapshots recorded yet.</p>
      )}
    </div>
  );
}
