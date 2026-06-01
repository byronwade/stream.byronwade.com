import Link from "next/link";
import { getAllClips } from "@/lib/data";
import { formatDuration } from "@/lib/utils/format";

export const metadata = { title: "Clips" };

export default function ClipsPage() {
  const clips = [...getAllClips()].sort((a, b) => b.views - a.views);

  return (
    <div className="section-shell py-8">
      <h1 className="text-2xl font-bold">Clips</h1>
      <p className="mt-1 text-text-secondary">Highlights from live streams across Stream.</p>

      <div className="mt-6 flex gap-2">
        <span className="pill-nav-active text-xs">Popular</span>
        <span className="pill-nav text-xs opacity-60">Recent</span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {clips.map((clip) => (
          <Link
            key={clip.id}
            href={`/clips/${clip.id}`}
            className="group overflow-hidden rounded-card border border-border-subtle bg-bg-elevated hover:border-border-strong focus-ring"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={clip.posterUrl}
              alt=""
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
    </div>
  );
}
