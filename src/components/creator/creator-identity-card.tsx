"use client";

import Link from "next/link";
import type { Creator } from "@/lib/types";
import { useFollows } from "@/lib/stores/follow";
import { useUIStore } from "@/lib/stores/ui";
import { formatViewerCount } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

interface CreatorIdentityCardProps {
  creator: Creator;
  compact?: boolean;
}

export function CreatorIdentityCard({ creator, compact }: CreatorIdentityCardProps) {
  const { isFollowingCreator, toggleCreator } = useFollows();
  const { addToast } = useUIStore();
  const following = isFollowingCreator(creator.id);

  return (
    <div className={cn("flex items-start gap-4", compact && "gap-3")}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={creator.avatarUrl}
        alt=""
        width={compact ? 40 : 56}
        height={compact ? 40 : 56}
        className="rounded-full bg-bg-elevated"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/channels/${creator.handle}`} className="font-semibold hover:text-accent-primary focus-ring">
            {creator.displayName}
          </Link>
          {creator.verified && (
            <span className="text-xs text-accent-primary" aria-label="Verified">
              ✓
            </span>
          )}
          {creator.liveStreamId && <span className="live-badge">Live</span>}
        </div>
        <p className="text-sm text-text-secondary">@{creator.handle}</p>
        {!compact && <p className="mt-1 text-sm text-text-secondary line-clamp-2">{creator.bio}</p>}
        <p className="mt-1 text-xs text-text-tertiary">
          {formatViewerCount(creator.followerCount)} followers
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          toggleCreator(creator.id);
          addToast(following ? `Unfollowed ${creator.displayName}` : `Following ${creator.displayName}`);
        }}
        className={cn("btn-secondary shrink-0 text-sm", following && "border-accent-primary/30 bg-accent-primary/10")}
      >
        {following ? "Following" : "Follow"}
      </button>
    </div>
  );
}
