"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { StreamCard } from "@/components/stream/stream-card";
import { PillNav } from "@/components/shell/pill-nav";
import { SubscribeButton } from "@/components/creator/subscribe-dialog";
import { formatDuration } from "@/lib/utils/format";
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
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <SubscribeButton creatorId={creator.id} creatorName={creator.displayName} />
        <Link href="/messages" className="btn-secondary text-sm">
          Message
        </Link>
      </div>

      <PillNav items={tabs} activeKey={tab} className="mb-8" />

      {tab === "about" && (
        <div className="max-w-2xl space-y-4">
          <p>{creator.bio}</p>
          {creator.links.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {creator.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-nav focus-ring text-xs"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          )}
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
        <>
          {clips.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {clips.map((c) => (
                <Link
                  key={c.id}
                  href={`/clips/${c.id}`}
                  className="group overflow-hidden rounded-card border border-border-subtle bg-bg-elevated hover:border-border-strong focus-ring"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.posterUrl}
                    alt={`Clip thumbnail: ${c.title}`}
                    className="aspect-video w-full object-cover transition-transform group-hover:scale-[1.02]"
                    width={320}
                    height={180}
                  />
                  <div className="p-3">
                    <p className="text-sm font-medium line-clamp-2">{c.title}</p>
                    <p className="mt-1 text-xs text-text-tertiary">
                      {formatDuration(c.durationSeconds)} · {c.views.toLocaleString()} views
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary">No clips from this channel yet.</p>
          )}
        </>
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
