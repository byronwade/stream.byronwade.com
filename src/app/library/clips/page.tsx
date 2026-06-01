"use client";

import Link from "next/link";
import { useClips } from "@/lib/stores/clip";
import { getAllClips } from "@/lib/data";
import { formatDuration } from "@/lib/utils/format";

export default function LibraryClipsPage() {
  const { clips: userClips, removeClip } = useClips();
  const seeded = getAllClips();
  const seededIds = new Set(seeded.map((c) => c.id));
  const userOnly = userClips.filter((c) => !seededIds.has(c.id));
  const all = [...userOnly, ...seeded];

  return (
    <div className="section-shell py-8">
      <h1 className="text-2xl font-bold">My clips</h1>
      <p className="mt-1 text-text-secondary">Clips you created and saved.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {all.map((clip) => {
          const isUserClip = userClips.some((c) => c.id === clip.id);
          const href = isUserClip ? `/clips/view?id=${clip.id}` : `/clips/${clip.id}`;
          return (
            <div key={clip.id} className="solid-surface">
            <Link href={href} className="font-semibold hover:text-accent-primary">
              {clip.title}
            </Link>
            <p className="mt-1 text-xs text-text-tertiary">
              {formatDuration(clip.durationSeconds)} · {clip.views} views
            </p>
            {userClips.some((c) => c.id === clip.id) && (
              <button
                type="button"
                onClick={() => removeClip(clip.id)}
                className="btn-secondary mt-3 text-xs"
              >
                Delete
              </button>
            )}
            </div>
          );
        })}
      </div>

      {all.length === 0 && (
        <p className="mt-8 text-text-secondary">No clips yet. Press C on a watch page to create one.</p>
      )}
    </div>
  );
}
