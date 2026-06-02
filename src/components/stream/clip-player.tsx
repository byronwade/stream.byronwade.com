"use client";

import { useEffect, useRef } from "react";
import { formatDuration } from "@/lib/utils/format";

interface ClipPlayerProps {
  src: string;
  poster: string;
  title: string;
  startSecond: number;
  endSecond: number;
}

/**
 * Plays only the trimmed [startSecond, endSecond] window of a clip's source video and
 * loops within it. Because the demo source loop is short, the window is clamped onto the
 * real video duration while preserving the clip length.
 */
export function ClipPlayer({ src, poster, title, startSecond, endSecond }: ClipPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const windowRef = useRef({ start: startSecond, end: endSecond });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const computeWindow = () => {
      const dur = video.duration;
      let start = startSecond;
      let end = endSecond;
      if (!Number.isFinite(dur) || dur <= 0) {
        windowRef.current = { start: 0, end: endSecond };
        return;
      }
      if (end > dur) {
        const len = Math.min(endSecond - startSecond, dur);
        start = Math.min(startSecond % dur, Math.max(0, dur - len));
        end = start + len;
      }
      windowRef.current = { start, end };
      if (video.currentTime < start || video.currentTime > end) {
        video.currentTime = start;
      }
    };

    const onTimeUpdate = () => {
      const { start, end } = windowRef.current;
      if (video.currentTime >= end - 0.05 || video.currentTime < start - 0.5) {
        video.currentTime = start;
        video.play().catch(() => {});
      }
    };

    video.addEventListener("loadedmetadata", computeWindow);
    video.addEventListener("timeupdate", onTimeUpdate);
    if (video.readyState >= 1) computeWindow();

    return () => {
      video.removeEventListener("loadedmetadata", computeWindow);
      video.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [startSecond, endSecond, src]);

  return (
    <div className="space-y-2">
      <div className="video-stage">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          controls
          autoPlay
          muted
          playsInline
          className="aspect-video w-full bg-black"
          aria-label={title}
        />
      </div>
      <p className="text-xs text-text-tertiary">
        Trimmed to {formatDuration(startSecond)}–{formatDuration(endSecond)} of the source stream.
      </p>
    </div>
  );
}
