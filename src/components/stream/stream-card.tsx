"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { getCreatorById } from "@/lib/data";
import type { Stream } from "@/lib/types";
import { formatViewerCount } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

interface StreamCardProps {
  stream: Stream;
  density?: "compact" | "default" | "hero";
  showReason?: boolean;
  layoutId?: string;
}

export function StreamCard({
  stream,
  density = "default",
  showReason = false,
  layoutId,
}: StreamCardProps) {
  const creator = getCreatorById(stream.creatorId);

  const content = (
    <>
      <div
        className={cn(
          "relative overflow-hidden bg-bg-stage",
          density === "hero" ? "aspect-video" : density === "compact" ? "aspect-[16/10]" : "aspect-video",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={stream.thumbnailUrl}
          alt=""
          className="h-full w-full object-cover"
          width={640}
          height={360}
        />
        {stream.state === "live" && (
          <span className="live-badge absolute left-3 top-3">Live</span>
        )}
        {stream.state === "live" && (
          <span className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-1 text-xs font-medium">
            {formatViewerCount(stream.viewerCount)} viewers
          </span>
        )}
      </div>
      <div className={cn("p-3", density === "hero" && "p-4")}>
        <h3 className={cn("font-semibold line-clamp-2", density === "hero" ? "text-lg" : "text-sm")}>
          {stream.title}
        </h3>
        <p className="mt-1 text-sm text-text-secondary">{creator?.displayName}</p>
        {showReason && (
          <p className="mt-2 text-xs text-accent-primary/80">{stream.discovery.recommendationReason}</p>
        )}
      </div>
    </>
  );

  const wrapperCls = cn(
    "group block overflow-hidden rounded-card border border-border-subtle bg-bg-elevated transition-transform hover:border-border-strong focus-ring",
    density === "hero" && "md:col-span-2",
  );

  if (layoutId) {
    return (
      <motion.div layoutId={layoutId} className={wrapperCls}>
        <Link href={`/live/${stream.slug}`}>{content}</Link>
      </motion.div>
    );
  }

  return (
    <Link href={`/live/${stream.slug}`} className={cn(wrapperCls, "hover:-translate-y-0.5")}>
      {content}
    </Link>
  );
}
