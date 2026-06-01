"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAllCategories } from "@/lib/data";
import { useUIStore } from "@/lib/stores/ui";

const STEPS = ["Details", "Category", "Preview", "Go Live"];

export function GoLiveWizard() {
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("creative");
  const [tags, setTags] = useState("");
  const [goingLive, setGoingLive] = useState(false);
  const router = useRouter();
  const { addToast } = useUIStore();
  const categories = getAllCategories();

  const handleGoLive = async () => {
    setGoingLive(true);
    await new Promise((r) => setTimeout(r, 1500));
    addToast("You're live! (simulated)");
    router.push("/studio/stream-manager");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex gap-2">
        {STEPS.map((s, i) => (
          <span
            key={s}
            className={i <= step ? "pill-nav-active text-xs" : "pill-nav text-xs opacity-50"}
          >
            {s}
          </span>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-4 solid-surface">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Stream title"
            className="input-field"
          />
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated)"
            className="input-field"
          />
        </div>
      )}

      {step === 1 && (
        <div className="grid grid-cols-2 gap-3">
          {categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setCategory(c.slug)}
              className={category === c.slug ? "pill-nav-active" : "pill-nav focus-ring"}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="video-stage aspect-video flex items-center justify-center bg-bg-stage">
          <div className="text-center">
            <p className="text-lg font-semibold">{title || "Untitled stream"}</p>
            <p className="text-sm text-text-secondary">{category}</p>
            <p className="mt-4 live-badge">Preview</p>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="solid-surface text-center">
          <p className="text-lg font-semibold">Ready to go live?</p>
          <p className="mt-2 text-sm text-text-secondary">
            This is a simulated go-live flow. No real broadcast will start.
          </p>
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="btn-secondary"
        >
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={() => setStep(step + 1)} className="btn-primary">
            Next
          </button>
        ) : (
          <button type="button" onClick={handleGoLive} disabled={goingLive} className="btn-primary">
            {goingLive ? "Starting..." : "Go Live"}
          </button>
        )}
      </div>
    </div>
  );
}
