"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { MoodRail } from "@/components/stream/mood-rail";
import { StreamCard } from "@/components/stream/stream-card";
import { ContinueWatchingRail } from "@/components/stream/continue-watching-rail";
import { filterStreams } from "@/lib/data";
import type { Mood } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

function DiscoverContent() {
  const searchParams = useSearchParams();
  const mood = searchParams.get("mood") as Mood | null;
  const size = searchParams.get("size") as "small" | "medium" | "large" | null;
  const sort = (searchParams.get("sort") as "fit" | "viewers" | "recent") ?? "fit";

  const streams = filterStreams({
    mood: mood ?? undefined,
    size: size ?? undefined,
    sort,
  });

  return (
    <div className="section-shell py-8">
      <h1 className="text-2xl font-bold">Discover</h1>
      <p className="mt-1 text-text-secondary">Find streams that fit your mood and community size.</p>

      <ContinueWatchingRail className="mt-8" />

      <div className="mt-6">
        <MoodRail linkMode selected={mood ?? undefined} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["fit", "viewers", "recent"] as const).map((s) => (
          <a
            key={s}
            href={`/discover?${new URLSearchParams({ ...(mood ? { mood } : {}), ...(size ? { size } : {}), sort: s }).toString()}`}
            className={cn(sort === s ? "pill-nav-active" : "pill-nav focus-ring")}
          >
            {s === "fit" ? "Best fit" : s === "viewers" ? "Most viewers" : "Recent"}
          </a>
        ))}
        {(["small", "medium", "large"] as const).map((s) => (
          <a
            key={s}
            href={`/discover?${new URLSearchParams({ ...(mood ? { mood } : {}), size: s, sort }).toString()}`}
            className={cn(size === s ? "pill-nav-active" : "pill-nav focus-ring")}
          >
            {s} communities
          </a>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {streams.map((stream) => (
          <StreamCard key={stream.id} stream={stream} showReason />
        ))}
      </div>

      {streams.length === 0 && (
        <p className="mt-8 text-center text-text-secondary">No streams match these filters.</p>
      )}
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="section-shell py-12">Loading...</div>}>
      <DiscoverContent />
    </Suspense>
  );
}
