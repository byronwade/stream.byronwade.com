import { cn } from "@/lib/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-pulse rounded-md bg-bg-elevated-2 motion-reduce:animate-none",
        className,
      )}
    />
  );
}

export function StreamCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-video w-full rounded-card" />
      <div className="flex gap-3">
        <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <StreamCardSkeleton key={i} />
      ))}
    </div>
  );
}
