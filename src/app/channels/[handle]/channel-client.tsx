"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { StreamCard } from "@/components/stream/stream-card";
import { PillNav } from "@/components/shell/pill-nav";
import type { Clip, Creator, Stream } from "@/lib/types";

interface ChannelClientProps {
  creator: Creator;
  streams: Stream[];
  clips: Clip[];
}

function ChannelContent({ creator, streams, clips }: ChannelClientProps) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "about";

  const tabs = [
    { key: "about", label: "About", href: `/channels/${creator.handle}?tab=about` },
    { key: "clips", label: "Clips", href: `/channels/${creator.handle}?tab=clips` },
    { key: "schedule", label: "Schedule", href: `/channels/${creator.handle}?tab=schedule` },
  ];

  return (
    <>
      <PillNav items={tabs} activeKey={tab} className="mb-8" />

      {tab === "about" && (
        <div className="max-w-2xl space-y-4">
          <p>{creator.bio}</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="solid-surface text-center">
              <p className="text-2xl font-bold">{creator.stats.averageViewers}</p>
              <p className="text-xs text-text-secondary">Avg viewers</p>
            </div>
            <div className="solid-surface text-center">
              <p className="text-2xl font-bold">{creator.stats.chatHealthAverage}</p>
              <p className="text-xs text-text-secondary">Chat health</p>
            </div>
            <div className="solid-surface text-center">
              <p className="text-2xl font-bold">{creator.stats.newViewerResponseRate}%</p>
              <p className="text-xs text-text-secondary">Response rate</p>
            </div>
            <div className="solid-surface text-center">
              <p className="text-2xl font-bold">{creator.stats.streamConsistencyScore}</p>
              <p className="text-xs text-text-secondary">Consistency</p>
            </div>
          </div>
          {streams.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {streams.map((s) => (
                <StreamCard key={s.id} stream={s} />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "clips" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clips.map((c) => (
            <Link key={c.id} href={`/clips/${c.id}`} className="solid-surface hover:border-accent-primary/30 focus-ring">
              {c.title}
            </Link>
          ))}
        </div>
      )}

      {tab === "schedule" && (
        <ul className="space-y-3">
          {creator.schedule.length === 0 ? (
            <p className="text-text-secondary">No upcoming streams scheduled.</p>
          ) : (
            creator.schedule.map((s) => (
              <li key={s.id} className="solid-surface flex justify-between">
                <span>{s.title}</span>
                <span className="text-sm text-text-secondary">
                  {new Date(s.startsAt).toLocaleString()}
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </>
  );
}

export function ChannelClient(props: ChannelClientProps) {
  return (
    <Suspense fallback={<div className="text-text-secondary">Loading...</div>}>
      <ChannelContent {...props} />
    </Suspense>
  );
}
