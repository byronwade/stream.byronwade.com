"use client";

import Link from "next/link";
import { useClips } from "@/lib/stores/clip";
import { formatDuration } from "@/lib/utils/format";

export default function LibraryClipsPage() {
  const { clips: userClips, removeClip } = useClips();

  return (
    <div className="section-shell py-8">
      <h1 className="text-2xl font-bold">My clips</h1>
      <p className="mt-1 text-text-secondary">Clips you created and saved on this device.</p>

      {userClips.length === 0 ? (
        <div className="mt-8 solid-surface max-w-lg text-sm text-text-secondary">
          <p className="font-medium text-text-primary">No clips yet</p>
          <p className="mt-1">
            Open any live stream and press <kbd className="rounded bg-bg-elevated-2 px-1.5 py-0.5">C</kbd>{" "}
            (or use the Clip button) to capture a moment. Your clips are stored locally for this demo.
          </p>
          <Link href="/clips" className="btn-secondary mt-4 inline-flex text-sm">
            Browse all clips
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {userClips.map((clip) => (
            <div
              key={clip.id}
              className="group overflow-hidden rounded-card border border-border-subtle bg-bg-elevated"
            >
              <Link href={`/clips/view?id=${clip.id}`} className="block focus-ring">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={clip.posterUrl}
                  alt={`Clip thumbnail: ${clip.title}`}
                  className="aspect-video w-full object-cover transition-transform group-hover:scale-[1.02]"
                  width={320}
                  height={180}
                />
                <div className="p-3">
                  <p className="text-sm font-medium line-clamp-2">{clip.title}</p>
                  <p className="mt-1 text-xs text-text-tertiary">
                    {formatDuration(clip.durationSeconds)} · {clip.views} views
                  </p>
                </div>
              </Link>
              <div className="px-3 pb-3">
                <button
                  type="button"
                  onClick={() => removeClip(clip.id)}
                  className="btn-secondary text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
