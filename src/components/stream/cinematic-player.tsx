"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Stream } from "@/lib/types";
import { useWatchPrefs } from "@/lib/stores/watch";
import { cn } from "@/lib/utils/cn";

const QUALITIES = [
  { label: "Auto", value: "auto" },
  { label: "1080p", value: "1080" },
  { label: "720p", value: "720" },
  { label: "480p", value: "480" },
];

interface CinematicPlayerProps {
  stream: Stream;
  autoplay?: boolean;
  mutedByDefault?: boolean;
  onTimeUpdate?: (seconds: number) => void;
  onClipRequest?: (seconds: number) => void;
}

export function CinematicPlayer({
  stream,
  autoplay = true,
  mutedByDefault = false,
  onTimeUpdate,
  onClipRequest,
}: CinematicPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(!autoplay);
  const [muted, setMuted] = useState(mutedByDefault);
  const { quality, captionsEnabled, theaterMode, setQuality, setCaptions, setTheaterMode } =
    useWatchPrefs();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "c" || e.key === "C") onClipRequest?.(videoRef.current?.currentTime ?? 0);
      if (e.key === " ") {
        e.preventDefault();
        const v = videoRef.current;
        if (v) {
          if (v.paused) v.play();
          else v.pause();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClipRequest]);

  const handleTimeUpdate = useCallback(() => {
    const t = videoRef.current?.currentTime ?? 0;
    onTimeUpdate?.(t);
  }, [onTimeUpdate]);

  return (
    <div className={cn("video-stage relative w-full", theaterMode && "rounded-none")}>
      <video
        ref={videoRef}
        src={stream.videoUrl}
        poster={stream.posterUrl}
        className="aspect-video w-full bg-black object-contain"
        autoPlay={autoplay}
        muted={muted}
        loop
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        aria-label={`Video player: ${stream.title}`}
      >
        {captionsEnabled && (
          <track kind="captions" src="/media/demo/captions.vtt" srcLang="en" label="English" default />
        )}
      </video>

      <div className="absolute bottom-0 left-0 right-0 flex flex-wrap items-center gap-2 bg-gradient-to-t from-black/80 to-transparent p-4">
        <button
          type="button"
          onClick={() => {
            const v = videoRef.current;
            if (!v) return;
            if (v.paused) v.play();
            else v.pause();
          }}
          className="focus-ring rounded-lg bg-white/10 px-3 py-1.5 text-sm backdrop-blur"
          aria-label={paused ? "Play" : "Pause"}
        >
          {paused ? "Play" : "Pause"}
        </button>
        <button
          type="button"
          onClick={() => {
            setMuted(!muted);
            if (videoRef.current) videoRef.current.muted = !muted;
          }}
          className="focus-ring rounded-lg bg-white/10 px-3 py-1.5 text-sm backdrop-blur"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? "Unmute" : "Mute"}
        </button>
        <button
          type="button"
          onClick={() => setCaptions(!captionsEnabled)}
          className={cn(
            "focus-ring rounded-lg px-3 py-1.5 text-sm backdrop-blur",
            captionsEnabled ? "bg-accent-primary/30" : "bg-white/10",
          )}
          aria-pressed={captionsEnabled}
        >
          CC
        </button>
        <button
          type="button"
          onClick={() => setTheaterMode(!theaterMode)}
          className="focus-ring rounded-lg bg-white/10 px-3 py-1.5 text-sm backdrop-blur"
          aria-pressed={theaterMode}
        >
          Theater
        </button>
        <div className="ml-auto flex gap-1">
          {QUALITIES.map((q) => (
            <button
              key={q.value}
              type="button"
              onClick={() => setQuality(q.value)}
              className={cn(
                "focus-ring rounded-lg px-2 py-1 text-xs backdrop-blur",
                quality === q.value ? "bg-accent-primary/40" : "bg-white/10",
              )}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
