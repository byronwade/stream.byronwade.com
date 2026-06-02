import Link from "next/link";
import { AnalyticsCard } from "@/components/studio/analytics-card";
import { getAnalyticsByStreamId, getFeaturedStream } from "@/lib/data";

export const metadata = { title: "Studio" };

export default function StudioPage() {
  const stream = getFeaturedStream();
  const analytics = getAnalyticsByStreamId(stream.id);
  const latest = analytics[analytics.length - 1];

  return (
    <div className="section-shell py-8">
      <div className="mb-8 flex flex-wrap gap-3">
        <Link href="/studio/go-live" className="btn-primary">
          Go Live
        </Link>
        <Link href="/studio/stream-manager" className="btn-secondary">
          Stream Manager
        </Link>
        <Link href="/studio/monetization" className="btn-secondary">
          Monetization
        </Link>
        <Link href="/studio/moderation" className="btn-secondary">
          Moderation
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard label="Live viewers" value={stream.viewerCount} delta="+12% vs last stream" chartData={latest?.retention} />
        <AnalyticsCard label="Chat health" value={`${stream.health.chatHealthScore}/100`} delta="Stable" />
        <AnalyticsCard label="Follows gained" value={latest?.followsGained ?? 0} delta="+8 today" />
        <AnalyticsCard label="Clips created" value={latest?.clipsCreated ?? 0} />
      </div>

      <section className="mt-12 solid-surface">
        <h2 className="font-semibold">Recent activity</h2>
        <ul className="mt-4 space-y-2 text-sm text-text-secondary">
          <li>New follower milestone reached</li>
          <li>Clip &quot;Bridge complete moment&quot; trending</li>
          <li>Chat health score improved to 94</li>
        </ul>
      </section>
    </div>
  );
}
