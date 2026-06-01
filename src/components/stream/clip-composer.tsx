"use client";

import { useState } from "react";
import Link from "next/link";
import type { Stream } from "@/lib/types";
import { useClips } from "@/lib/stores/clip";
import { useSession } from "@/lib/stores/session";
import { useUIStore } from "@/lib/stores/ui";
import { validateClipTrim } from "@/lib/utils/catch-up";
import { formatDuration } from "@/lib/utils/format";

interface ClipComposerProps {
  stream: Stream;
  currentTime: number;
  onClose: () => void;
}

export function ClipComposer({ stream, currentTime, onClose }: ClipComposerProps) {
  const [start, setStart] = useState(Math.max(0, Math.floor(currentTime - 15)));
  const [end, setEnd] = useState(Math.min(stream.durationSeconds, Math.floor(currentTime + 15)));
  const [title, setTitle] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const { addClip } = useClips();
  const { user } = useSession();
  const { addToast } = useUIStore();

  const validation = validateClipTrim(start, end, stream.durationSeconds);

  const handlePublish = async () => {
    if (!validation.valid) return;
    setPublishing(true);
    await new Promise((r) => setTimeout(r, 800));

    const id = `clip_${Date.now()}`;
    const url = `/clips/view?id=${id}`;
    addClip({
      id,
      streamId: stream.id,
      creatorId: stream.creatorId,
      title: title || `Clip from ${stream.title}`,
      slug: id,
      startSecond: start,
      endSecond: end,
      durationSeconds: end - start,
      posterUrl: stream.posterUrl,
      mp4Url: stream.videoUrl,
      createdByUserId: user?.id ?? "guest",
      createdAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      shareUrl: url,
    });

    setPublishedUrl(url);
    addToast("Clip published — view it in your library.");
    setPublishing(false);
  };

  if (publishedUrl) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-lg font-semibold text-success">Clip published!</p>
        <Link href={publishedUrl} className="btn-primary inline-flex" onClick={onClose}>
          View clip
        </Link>
        <Link href="/library/clips" className="btn-secondary ml-2 inline-flex">
          My clips
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-secondary">
        Trim your clip (5–60 seconds). Press <kbd className="rounded bg-bg-elevated px-1">C</kbd> anytime to open this panel.
      </p>

      <div className="space-y-2">
        <label className="muted-label">Start ({formatDuration(start)})</label>
        <input
          type="range"
          min={0}
          max={stream.durationSeconds - 5}
          value={start}
          onChange={(e) => setStart(Number(e.target.value))}
          className="w-full"
        />
        <label className="muted-label">End ({formatDuration(end)})</label>
        <input
          type="range"
          min={5}
          max={stream.durationSeconds}
          value={end}
          onChange={(e) => setEnd(Number(e.target.value))}
          className="w-full"
        />
        <p className="text-sm">Duration: {formatDuration(end - start)}</p>
        {!validation.valid && <p className="text-sm text-danger">{validation.error}</p>}
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Clip title"
        className="input-field"
        aria-label="Clip title"
      />

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handlePublish}
          disabled={!validation.valid || publishing}
          className="btn-primary"
        >
          {publishing ? "Publishing..." : "Publish clip"}
        </button>
        <Link href="/library/clips" className="btn-secondary">
          My clips
        </Link>
      </div>
    </div>
  );
}
