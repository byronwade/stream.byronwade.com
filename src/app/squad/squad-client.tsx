"use client";

import { Suspense, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getLiveStreams, getCreatorById } from "@/lib/data";
import { cn } from "@/lib/utils/cn";

const MAX = 4;

function gridClass(count: number) {
  if (count <= 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-1 md:grid-cols-2";
  if (count === 3) return "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";
  return "grid-cols-1 md:grid-cols-2";
}

function SquadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const live = getLiveStreams();

  const selected = useMemo(() => {
    const raw = (searchParams.get("streams") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const valid = raw.filter((slug) => live.some((s) => s.slug === slug)).slice(0, MAX);
    if (valid.length > 0) return valid;
    return live.slice(0, 2).map((s) => s.slug);
  }, [searchParams, live]);

  const audio = searchParams.get("audio") ?? selected[0] ?? null;

  const update = useCallback(
    (next: string[], nextAudio?: string | null) => {
      const params = new URLSearchParams();
      if (next.length) params.set("streams", next.join(","));
      const a = nextAudio ?? (next.includes(audio ?? "") ? audio : next[0]);
      if (a && next.includes(a)) params.set("audio", a);
      router.replace(`/squad?${params.toString()}`, { scroll: false });
    },
    [router, audio],
  );

  const toggle = (slug: string) => {
    if (selected.includes(slug)) {
      update(selected.filter((s) => s !== slug));
    } else if (selected.length < MAX) {
      update([...selected, slug]);
    }
  };

  return (
    <div className="section-shell py-8">
      <h1 className="text-2xl font-bold">Squad multistream</h1>
      <p className="mt-1 text-text-secondary">
        Watch up to {MAX} live streams at once. One stream plays audio at a time.
      </p>

      <div className="mt-6 flex flex-wrap gap-2" aria-label="Pick live streams">
        {live.map((s) => {
          const on = selected.includes(s.slug);
          const disabled = !on && selected.length >= MAX;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => toggle(s.slug)}
              disabled={disabled}
              aria-pressed={on}
              className={cn(
                on ? "pill-nav-active" : "pill-nav focus-ring",
                disabled && "cursor-not-allowed opacity-40",
              )}
            >
              {getCreatorById(s.creatorId)?.displayName ?? s.title}
            </button>
          );
        })}
      </div>

      {selected.length === 0 ? (
        <p className="mt-10 text-center text-text-secondary">Add a stream to start your squad view.</p>
      ) : (
        <div className={cn("mt-6 grid gap-4", gridClass(selected.length))}>
          {selected.map((slug) => {
            const stream = live.find((s) => s.slug === slug)!;
            const creator = getCreatorById(stream.creatorId);
            const hasAudio = audio === slug;
            return (
              <div key={slug} className="overflow-hidden rounded-card border border-border-subtle bg-bg-stage">
                <div className="relative">
                  <video
                    src={stream.videoUrl}
                    poster={stream.posterUrl}
                    className="aspect-video w-full bg-black object-cover"
                    autoPlay
                    muted={!hasAudio}
                    loop
                    playsInline
                    aria-label={`${stream.title} (${hasAudio ? "audio on" : "muted"})`}
                  />
                  <span className="live-badge absolute left-2 top-2">Live</span>
                </div>
                <div className="flex items-center justify-between gap-2 px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{stream.title}</p>
                    <p className="truncate text-xs text-text-secondary">{creator?.displayName}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => update(selected, slug)}
                      aria-pressed={hasAudio}
                      className={cn(
                        "focus-ring rounded px-2 py-1 text-xs",
                        hasAudio ? "bg-accent-primary/20 text-accent-primary" : "text-text-secondary hover:text-text-primary",
                      )}
                    >
                      {hasAudio ? "Audio ✓" : "Audio"}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggle(slug)}
                      className="focus-ring rounded px-2 py-1 text-xs text-text-secondary hover:text-text-primary"
                      aria-label={`Remove ${stream.title}`}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function SquadClient() {
  return (
    <Suspense fallback={<div className="section-shell py-12 text-text-secondary">Loading squad…</div>}>
      <SquadContent />
    </Suspense>
  );
}
