"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Clip } from "@/lib/types";
import { formatDuration } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

type Sort = "popular" | "recent";

export function ClipsClient({ clips }: { clips: Clip[] }) {
  const [sort, setSort] = useState<Sort>("popular");

  const sorted = useMemo(() => {
    const copy = [...clips];
    if (sort === "recent") {
      copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      copy.sort((a, b) => b.views - a.views);
    }
    return copy;
  }, [clips, sort]);

  return (
    <>
      <div className="mt-6 flex gap-2" role="tablist" aria-label="Sort clips">
        {(["popular", "recent"] as const).map((s) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={sort === s}
            onClick={() => setSort(s)}
            className={cn(sort === s ? "pill-nav-active" : "pill-nav focus-ring", "text-xs capitalize")}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sorted.map((clip) => (
          <Link
            key={clip.id}
            href={`/clips/${clip.id}`}
            className="group overflow-hidden rounded-card border border-border-subtle bg-bg-elevated hover:border-border-strong focus-ring"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={clip.posterUrl}
              alt={`Clip thumbnail: ${clip.title}`}
              className="aspect-video w-full object-cover transition-transform group-hover:scale-[1.02]"
              width={320}
              height={180}
            />
            <div className="p-4">
              <h2 className="font-semibold line-clamp-2">{clip.title}</h2>
              <p className="mt-1 text-xs text-text-tertiary">
                {formatDuration(clip.durationSeconds)} · {clip.views.toLocaleString()} views
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
