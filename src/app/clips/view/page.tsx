"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ClipPlayer } from "@/components/stream/clip-player";
import { getClipById as getStaticClip, getStreamById, getCreatorById } from "@/lib/data";
import { useClips } from "@/lib/stores/clip";
import { formatDuration } from "@/lib/utils/format";

function ClipViewContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { getClip: getUserClip } = useClips();

  if (!id) {
    return (
      <div className="section-shell py-12 text-center">
        <p className="text-text-secondary">No clip specified.</p>
        <Link href="/clips" className="btn-primary mt-4 inline-flex">
          Browse clips
        </Link>
      </div>
    );
  }

  const clip = getStaticClip(id) ?? getUserClip(id);

  if (!clip) {
    return (
      <div className="section-shell py-12 text-center">
        <p className="text-text-secondary">Clip not found. It may have been created in another browser session.</p>
        <Link href="/library/clips" className="btn-primary mt-4 inline-flex">
          My clips
        </Link>
      </div>
    );
  }

  const stream = getStreamById(clip.streamId);
  const creator = getCreatorById(clip.creatorId);

  return (
    <div className="section-shell py-8">
      <div className="mx-auto max-w-4xl">
        <ClipPlayer
          src={clip.mp4Url}
          poster={clip.posterUrl}
          title={clip.title}
          startSecond={clip.startSecond}
          endSecond={clip.endSecond}
        />

        <h1 className="mt-6 text-2xl font-bold">{clip.title}</h1>
        <p className="mt-2 text-sm text-text-secondary">
          {formatDuration(clip.durationSeconds)} · {clip.views.toLocaleString()} views ·{" "}
          {clip.likes.toLocaleString()} likes
        </p>

        {creator && (
          <p className="mt-2">
            by{" "}
            <Link href={`/channels/${creator.handle}`} className="text-accent-primary hover:underline">
              {creator.displayName}
            </Link>
          </p>
        )}

        {stream && (
          <Link href={`/live/${stream.slug}`} className="btn-primary mt-6 inline-flex">
            Watch source stream
          </Link>
        )}
      </div>
    </div>
  );
}

export default function ClipViewPage() {
  return (
    <Suspense fallback={<div className="section-shell py-12">Loading clip...</div>}>
      <ClipViewContent />
    </Suspense>
  );
}
