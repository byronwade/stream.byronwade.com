import type { Stream } from "@/lib/types";

export function resolveCatchUpMoments(stream: Stream, currentTimeSeconds: number) {
  const moments = stream.catchUp.moments
    .filter((m) => m.atSecond <= currentTimeSeconds)
    .sort((a, b) => b.atSecond - a.atSecond)
    .slice(0, 3);

  const timelineEvents = stream.timeline
    .filter((e) => e.atSecond <= currentTimeSeconds)
    .sort((a, b) => b.atSecond - a.atSecond)
    .slice(0, 3);

  return { moments, timelineEvents };
}

export function shouldShowJoinLate(stream: Stream, thresholdSeconds = 45): boolean {
  if (stream.state !== "live" || !stream.startedAt) return false;
  const elapsed = (Date.now() - new Date(stream.startedAt).getTime()) / 1000;
  return elapsed > thresholdSeconds;
}

export function getJoinLateHeadline(stream: Stream): string {
  if (!stream.startedAt) return "";
  const elapsed = Math.floor((Date.now() - new Date(stream.startedAt).getTime()) / 60000);
  return `You joined ${elapsed} minutes in`;
}

export function validateClipTrim(
  startSecond: number,
  endSecond: number,
  maxDuration: number,
): { valid: boolean; error?: string } {
  if (startSecond < 0) return { valid: false, error: "Start time cannot be negative" };
  if (endSecond > maxDuration) return { valid: false, error: "End time exceeds stream duration" };
  if (endSecond - startSecond < 5) return { valid: false, error: "Clip must be at least 5 seconds" };
  if (endSecond - startSecond > 60) return { valid: false, error: "Clip cannot exceed 60 seconds" };
  if (startSecond >= endSecond) return { valid: false, error: "Start must be before end" };
  return { valid: true };
}
