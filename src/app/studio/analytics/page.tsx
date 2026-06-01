"use client";

import { AnalyticsCard } from "@/components/studio/analytics-card";
import { getAnalyticsByStreamId, getFeaturedStream } from "@/lib/data";
import { useAnalyticsSimulator } from "@/lib/mock/simulators";

export default function StudioAnalyticsPage() {
  const stream = getFeaturedStream();
  const snapshots = getAnalyticsByStreamId(stream.id);
  const latest = snapshots[snapshots.length - 1];
  const retention = useAnalyticsSimulator(latest?.retention ?? [100, 90, 80, 70], true);

  return (
    <div className="section-shell py-8">
      <h2 className="mb-6 text-xl font-bold">Analytics — {stream.title}</h2>

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
        <svg viewBox="0 0 200 60" className="mt-4 h-32 w-full" aria-label="Retention chart">
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
    </div>
  );
}
