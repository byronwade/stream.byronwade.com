"use client";

import { useState } from "react";
import Link from "next/link";
import { BloomLayer } from "@/components/bloom/bloom-layer";
import { getAllClips } from "@/lib/data";
import { useClipEdits } from "@/lib/stores/clip-edits";
import { useUIStore } from "@/lib/stores/ui";
import type { Clip } from "@/lib/types";

export default function StudioClipsPage() {
  const clips = getAllClips();
  const { titleFor, featuredId, setTitle, setFeatured } = useClipEdits();
  const { addToast } = useUIStore();

  const [editing, setEditing] = useState<Clip | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftFeatured, setDraftFeatured] = useState(false);

  const featuredClip = clips.find((c) => c.id === featuredId) ?? clips[0];

  const openEdit = (clip: Clip) => {
    setEditing(clip);
    setDraftTitle(titleFor(clip.id, clip.title));
    setDraftFeatured(featuredId === clip.id);
  };

  const save = () => {
    if (!editing) return;
    setTitle(editing.id, draftTitle.trim() || editing.title);
    if (draftFeatured) setFeatured(editing.id);
    else if (featuredId === editing.id) setFeatured(null);
    addToast("Clip updated");
    setEditing(null);
  };

  return (
    <div className="section-shell py-8">
      <h2 className="mb-6 text-xl font-bold">Clip management</h2>

      <div className="mb-8 solid-surface">
        <h3 className="font-semibold">Featured on channel</h3>
        <p className="mt-1 text-sm text-text-secondary">
          {featuredClip ? titleFor(featuredClip.id, featuredClip.title) : "None"}
        </p>
      </div>

      <div className="space-y-3">
        {clips.map((clip) => (
          <div key={clip.id} className="solid-surface flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium">
                {titleFor(clip.id, clip.title)}
                {featuredId === clip.id && (
                  <span className="ml-2 rounded-chip bg-accent-primary/15 px-2 py-0.5 text-xs text-accent-primary">
                    Featured
                  </span>
                )}
              </p>
              <p className="text-xs text-text-tertiary">
                {clip.views} views · {clip.likes} likes
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={`/clips/${clip.id}`} className="btn-secondary text-xs">
                View
              </Link>
              <button type="button" onClick={() => openEdit(clip)} className="btn-secondary text-xs">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      <BloomLayer open={!!editing} onClose={() => setEditing(null)} title="Edit clip" className="max-w-md">
        {editing && (
          <div className="space-y-4">
            <div>
              <label htmlFor="clip-title" className="muted-label">
                Title
              </label>
              <input
                id="clip-title"
                type="text"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                className="input-field mt-1"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draftFeatured}
                onChange={(e) => setDraftFeatured(e.target.checked)}
                className="focus-ring"
              />
              Feature this clip on the channel
            </label>
            <p className="text-xs text-text-tertiary">
              Edits are stored locally for this demo — no server is contacted.
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={save} className="btn-primary">
                Save changes
              </button>
              <button type="button" onClick={() => setEditing(null)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        )}
      </BloomLayer>
    </div>
  );
}
