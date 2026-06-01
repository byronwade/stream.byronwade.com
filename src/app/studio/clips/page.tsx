import Link from "next/link";
import { getAllClips } from "@/lib/data";

export const metadata = { title: "Studio Clips" };

export default function StudioClipsPage() {
  const clips = getAllClips();

  return (
    <div className="section-shell py-8">
      <h2 className="mb-6 text-xl font-bold">Clip management</h2>

      <div className="mb-8 solid-surface">
        <h3 className="font-semibold">Featured on channel</h3>
        <p className="mt-1 text-sm text-text-secondary">{clips[0]?.title ?? "None"}</p>
      </div>

      <div className="space-y-3">
        {clips.map((clip) => (
          <div key={clip.id} className="solid-surface flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium">{clip.title}</p>
              <p className="text-xs text-text-tertiary">{clip.views} views · {clip.likes} likes</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/clips/${clip.id}`} className="btn-secondary text-xs">
                View
              </Link>
              <button type="button" className="btn-secondary text-xs">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
