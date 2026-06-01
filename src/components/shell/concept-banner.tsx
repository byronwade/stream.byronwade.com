"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

const DISMISS_KEY = "stream:v1:banner-dismissed";

function getInitialDismissed() {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(DISMISS_KEY) === "1";
}

export function ConceptBanner() {
  const [dismissed, setDismissed] = useState(getInitialDismissed);

  if (dismissed) return null;

  return (
    <div
      className="border-b border-accent-primary/20 bg-accent-primary/10"
      role="note"
      aria-label="Project disclaimer"
    >
      <div className="section-shell flex flex-wrap items-center justify-between gap-3 py-2 text-sm">
        <p className="text-text-secondary">
          <span className="font-medium text-text-primary">Frontend concept.</span> Stream simulates
          live platform flows — auth, chat, clips, and studio are mocked client-side.
        </p>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem(DISMISS_KEY, "1");
            setDismissed(true);
          }}
          className={cn("btn-secondary shrink-0 px-3 py-1 text-xs")}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
