"use client";

import Link from "next/link";
import type { Stream } from "@/lib/types";
import { MOODS } from "@/lib/types";
import { useWatchPrefs } from "@/lib/stores/watch";
import { cn } from "@/lib/utils/cn";

interface WatchFilterPanelProps {
  stream: Stream;
}

const SIZES = [
  { value: "small", label: "Small communities" },
  { value: "medium", label: "Mid-size" },
  { value: "large", label: "Large" },
] as const;

/**
 * Discovery / mood preferences overlay. Lets a viewer jump to Discover pre-filtered
 * by the moods that match the current stream, and toggle a couple of viewing prefs.
 */
export function WatchFilterPanel({ stream }: WatchFilterPanelProps) {
  const { captionsEnabled, theaterMode, setCaptions, setTheaterMode } = useWatchPrefs();

  return (
    <div className="space-y-6">
      <p className="text-sm text-text-secondary">
        Tune what Stream recommends next. These shortcuts open Discover pre-filtered — your
        choices are mocked client-side.
      </p>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-text-secondary">Find more like this</h3>
        <div className="flex flex-wrap gap-2">
          {stream.moods.map((mood) => {
            const label = MOODS.find((m) => m.value === mood)?.label ?? mood;
            return (
              <Link key={mood} href={`/discover?mood=${mood}`} className="pill-nav focus-ring text-xs">
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-text-secondary">Community size</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <Link
              key={size.value}
              href={`/discover?size=${size.value}`}
              className="pill-nav focus-ring text-xs"
            >
              {size.label}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-text-secondary">Viewing preferences</h3>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCaptions(!captionsEnabled)}
            aria-pressed={captionsEnabled}
            className={cn("pill-nav focus-ring text-xs", captionsEnabled && "pill-nav-active")}
          >
            Captions {captionsEnabled ? "on" : "off"}
          </button>
          <button
            type="button"
            onClick={() => setTheaterMode(!theaterMode)}
            aria-pressed={theaterMode}
            className={cn("pill-nav focus-ring text-xs", theaterMode && "pill-nav-active")}
          >
            Theater mode {theaterMode ? "on" : "off"}
          </button>
        </div>
      </div>

      <Link href={`/categories/${stream.categorySlug}`} className="btn-secondary text-sm">
        Browse {stream.categorySlug} category
      </Link>
    </div>
  );
}
