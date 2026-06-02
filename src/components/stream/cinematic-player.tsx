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

export interface SeekSignal {
  seconds: number;
  nonce: number;
}

interface CinematicPlayerProps {
  stream: Stream;
  autoplay?: boolean;
  mutedByDefault?: boolean;
  onTimeUpdate?: (seconds: number) => void;
  onClipRequest?: (seconds: number) => void;
  /** When the nonce changes, the player seeks to `seconds`. */
  seekSignal?: SeekSignal | null;
  /** Scheduled-stream "notify me" state + handler. */
  notified?: boolean;
  onNotify?: () => void;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "Starting soon";
  const total = Math.floor(ms / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

export function CinematicPlayer({
  stream,
  autoplay = true,
  mutedByDefault = false,
  onTimeUpdate,
  onClipRequest,
  seekSignal,
  notified,
  onNotify,
}: CinematicPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(!autoplay);
  const [muted, setMuted] = useState(mutedByDefault);
  const {
    quality,
    captionsEnabled,
    theaterMode,
    audioOnly,
    captionStyle,
    setQuality,
    setCaptions,
    setTheaterMode,
    setAudioOnly,
  } = useWatchPrefs();

  const captionClasses = captionsEnabled
    ? `cap-${captionStyle.size} cap-bg-${captionStyle.background}`
    : "";

  const isScheduled = stream.state === "scheduled";
  const isEnded = stream.state === "ended";

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!isScheduled) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [isScheduled]);

  useEffect(() => {
    if (isScheduled) return;
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
  }, [onClipRequest, isScheduled]);

  // Seek when an external seek signal arrives (e.g. Catch Me Up jump-to-timestamp).
  useEffect(() => {
    if (!seekSignal) return;
    const v = videoRef.current;
    if (!v) return;
    const target = Math.min(Math.max(0, seekSignal.seconds), stream.durationSeconds);
    try {
      v.currentTime = target;
      v.play().catch(() => {});
    } catch {
      /* ignore */
    }
  }, [seekSignal, stream.durationSeconds]);

  const handleTimeUpdate = useCallback(() => {
    const t = videoRef.current?.currentTime ?? 0;
    onTimeUpdate?.(t);
  }, [onTimeUpdate]);

  const activeSource =
    stream.hlsUrl && quality === "auto"
      ? "HLS · Auto"
      : `MP4 · ${QUALITIES.find((q) => q.value === quality)?.label ?? "Auto"}`;

  if (isScheduled) {
    const target = stream.scheduledFor ? new Date(stream.scheduledFor).getTime() : 0;
    return (
      <div className="video-stage relative flex aspect-video w-full items-center justify-center bg-bg-stage">
        <div className="px-6 text-center">
          <span className="pill-nav-active text-xs uppercase tracking-wide">Scheduled</span>
          <p className="mt-4 text-sm text-text-secondary">Starts in</p>
          <p className="mt-1 text-3xl font-bold tabular-nums md:text-4xl" aria-live="polite">
            {formatCountdown(target - now)}
          </p>
          {stream.scheduledFor && (
            <p className="mt-2 text-sm text-text-tertiary">
              {new Date(stream.scheduledFor).toLocaleString()}
            </p>
          )}
          {onNotify && (
            <button
              type="button"
              onClick={onNotify}
              aria-pressed={notified}
              className={cn("btn-primary mt-6", notified && "bg-success")}
            >
              {notified ? "Reminder set ✓" : "Notify me"}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("video-stage relative w-full", theaterMode && "rounded-none")}>
      {isEnded && (
        <span className="absolute left-3 top-3 z-10 rounded-md bg-black/70 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-text-primary">
          VOD
        </span>
      )}
      <video
        ref={videoRef}
        src={stream.videoUrl}
        poster={stream.posterUrl}
        className={cn("aspect-video w-full bg-black object-contain", captionClasses, audioOnly && "opacity-0")}
        autoPlay={autoplay && !isEnded}
        muted={muted}
        loop={!isEnded}
        controls={isEnded && !audioOnly}
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        aria-label={`${isEnded ? "Recorded VOD" : "Video player"}: ${stream.title}`}
      >
        {captionsEnabled && (
          <track kind="captions" src="/media/demo/captions.vtt" srcLang="en" label="English" default />
        )}
      </video>

      {audioOnly && (
        <div className="absolute inset-x-0 top-0 bottom-14 flex flex-col items-center justify-center gap-4 bg-bg-stage">
          <div className="audio-viz" aria-hidden>
            {Array.from({ length: 9 }).map((_, i) => (
              <span
                key={i}
                className="audio-viz-bar"
                style={{ animationDelay: `${(i % 5) * 0.12}s` }}
              />
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-text-primary">Audio-only mode</p>
            <p className="text-xs text-text-secondary">Video hidden · audio still playing</p>
          </div>
          <button
            type="button"
            onClick={() => setAudioOnly(false)}
            className="btn-secondary text-xs"
          >
            Show video
          </button>
        </div>
      )}

      {!isEnded && (
        <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-wrap items-center gap-2 bg-gradient-to-t from-black/80 to-transparent p-4">
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
          <button
            type="button"
            onClick={() => setAudioOnly(!audioOnly)}
            className={cn(
              "focus-ring rounded-lg px-3 py-1.5 text-sm backdrop-blur",
              audioOnly ? "bg-accent-primary/30" : "bg-white/10",
            )}
            aria-pressed={audioOnly}
            title="Audio-only mode"
          >
            Audio
          </button>
          <div className="ml-auto flex items-center gap-2">
            <span className="rounded-lg bg-black/40 px-2 py-1 text-xs text-text-secondary" aria-live="polite">
              {activeSource}
            </span>
            <div className="flex gap-1">
              {QUALITIES.map((q) => (
                <button
                  key={q.value}
                  type="button"
                  onClick={() => setQuality(q.value)}
                  className={cn(
                    "focus-ring rounded-lg px-2 py-1 text-xs backdrop-blur",
                    quality === q.value ? "bg-accent-primary/40" : "bg-white/10",
                  )}
                  aria-pressed={quality === q.value}
                  title={
                    q.value === "auto" && stream.hlsUrl
                      ? "Adaptive HLS source"
                      : `Fixed ${q.label} MP4 source`
                  }
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
