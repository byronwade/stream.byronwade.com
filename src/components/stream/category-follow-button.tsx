"use client";

import { useFollows } from "@/lib/stores/follow";
import { useUIStore } from "@/lib/stores/ui";
import { cn } from "@/lib/utils/cn";

interface CategoryFollowButtonProps {
  slug: string;
  name: string;
}

/** Toggles a localStorage-backed follow for a browse category. */
export function CategoryFollowButton({ slug, name }: CategoryFollowButtonProps) {
  const { isFollowingCategory, toggleCategory } = useFollows();
  const { addToast } = useUIStore();
  const following = isFollowingCategory(slug);

  return (
    <button
      type="button"
      aria-pressed={following}
      onClick={() => {
        toggleCategory(slug);
        addToast(following ? `Unfollowed ${name}` : `Following ${name}`);
      }}
      className={cn(
        "btn-secondary text-sm",
        following && "border-accent-primary/40 bg-accent-primary/10 text-accent-primary",
      )}
    >
      {following ? "Following category" : "Follow category"}
    </button>
  );
}
