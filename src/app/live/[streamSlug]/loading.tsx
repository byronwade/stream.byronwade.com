import { Skeleton } from "@/components/ui/skeleton";

export default function WatchLoading() {
  return (
    <div className="section-shell py-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <Skeleton className="aspect-video w-full rounded-panel" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-9 w-28 rounded-full" />
          </div>
          <Skeleton className="h-20 w-full rounded-card" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-10 w-full rounded-card" />
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
