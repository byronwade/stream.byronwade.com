"use client";

import Link from "next/link";
import { MOODS, type Mood } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

interface MoodRailProps {
  selected?: Mood;
  onSelect?: (mood: Mood | undefined) => void;
  linkMode?: boolean;
}

export function MoodRail({ selected, onSelect, linkMode }: MoodRailProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" role="list" aria-label="Mood filters">
      {MOODS.map((mood) => {
        const isActive = selected === mood.value;
        const cls = cn(
          "shrink-0 rounded-chip border px-4 py-2 text-sm font-medium transition-colors focus-ring",
          isActive
            ? "border-accent-primary/30 bg-accent-primary/15 text-accent-primary"
            : "border-border-subtle bg-white/5 text-text-secondary hover:text-text-primary",
        );

        if (linkMode) {
          return (
            <Link key={mood.value} href={`/discover?mood=${mood.value}`} className={cls} role="listitem">
              {mood.label}
            </Link>
          );
        }

        return (
          <button
            key={mood.value}
            type="button"
            role="listitem"
            onClick={() => onSelect?.(isActive ? undefined : mood.value)}
            className={cls}
          >
            {mood.label}
          </button>
        );
      })}
    </div>
  );
}
