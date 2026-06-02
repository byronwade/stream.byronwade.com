import { Skeleton, CardGridSkeleton } from "@/components/ui/skeleton";

export default function DiscoverLoading() {
  return (
    <div className="section-shell py-8">
      <Skeleton className="mb-2 h-7 w-40" />
      <Skeleton className="mb-6 h-4 w-72" />
      <div className="mb-6 flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-full" />
        ))}
      </div>
      <CardGridSkeleton count={9} />
    </div>
  );
}
