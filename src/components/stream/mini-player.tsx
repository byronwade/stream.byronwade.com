"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface MiniPlayerStream {
  slug: string;
  title: string;
  creatorName: string;
  videoUrl: string;
  posterUrl: string;
}

interface MiniPlayerContextValue {
  active: MiniPlayerStream | null;
  setActive: (stream: MiniPlayerStream | null) => void;
}

const MiniPlayerContext = createContext<MiniPlayerContextValue | null>(null);

export function MiniPlayerProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<MiniPlayerStream | null>(null);
  const value = useMemo(() => ({ active, setActive }), [active]);
  return <MiniPlayerContext.Provider value={value}>{children}</MiniPlayerContext.Provider>;
}

export function useMiniPlayer() {
  const ctx = useContext(MiniPlayerContext);
  if (!ctx) {
    // Tolerate usage outside the provider (e.g. isolated tests/stories).
    return { active: null, setActive: () => {} } as MiniPlayerContextValue;
  }
  return ctx;
}

/**
 * Persistent corner mini-player. Renders only when a stream is "active" and the
 * viewer has navigated away from that stream's watch page. Pointer-draggable; the
 * watch page itself keeps the full <CinematicPlayer>, so this never double-renders.
 */
export function MiniPlayer() {
  const { active, setActive } = useMiniPlayer();
  const pathname = usePathname();
  const [muted, setMuted] = useState(true);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const dragState = useRef<{ dx: number; dy: number } | null>(null);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const target = e.currentTarget as HTMLElement;
    const rect = target.parentElement!.getBoundingClientRect();
    dragState.current = { dx: e.clientX - rect.left, dy: e.clientY - rect.top };
    target.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragState.current) return;
    const width = 320;
    const height = 220;
    const x = Math.min(Math.max(8, e.clientX - dragState.current.dx), window.innerWidth - width - 8);
    const y = Math.min(Math.max(8, e.clientY - dragState.current.dy), window.innerHeight - height - 8);
    setPos({ x, y });
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    dragState.current = null;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  if (!active) return null;
  // Hide while on the active stream's own watch page (the full player is there).
  if (pathname === `/live/${active.slug}`) return null;

  const style = pos
    ? { left: pos.x, top: pos.y, right: "auto", bottom: "auto", width: 300 }
    : { right: 16, bottom: 88, width: 300 };

  return (
    <div className="mini-player" style={style} role="region" aria-label="Mini player">
      <div
        className="flex cursor-grab items-center justify-between gap-2 bg-black/60 px-2 py-1 text-xs text-white active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <span className="truncate" title={active.title}>
          {active.title}
        </span>
        <span aria-hidden className="text-white/50">
          ⠿
        </span>
      </div>
      <video
        src={active.videoUrl}
        poster={active.posterUrl}
        className="aspect-video w-full bg-black object-cover"
        autoPlay
        muted={muted}
        loop
        playsInline
        aria-label={`Mini player: ${active.title}`}
      />
      <div className="flex items-center justify-between gap-2 bg-bg-stage px-2 py-1.5">
        <span className="truncate text-[11px] text-text-secondary">{active.creatorName}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            className="focus-ring rounded px-1.5 py-0.5 text-[11px] text-text-secondary hover:text-text-primary"
            aria-pressed={!muted}
          >
            {muted ? "Unmute" : "Mute"}
          </button>
          <Link
            href={`/live/${active.slug}`}
            className="focus-ring rounded px-1.5 py-0.5 text-[11px] text-accent-primary hover:underline"
          >
            Expand
          </Link>
          <button
            type="button"
            onClick={() => setActive(null)}
            className="focus-ring rounded px-1.5 py-0.5 text-[11px] text-text-secondary hover:text-text-primary"
            aria-label="Close mini player"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
