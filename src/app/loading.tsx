import { Skeleton, CardGridSkeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="section-shell py-8">
      <Skeleton className="mb-6 h-56 w-full rounded-panel" />
      <div className="mb-6 flex gap-2">
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
      <CardGridSkeleton count={8} />
    </div>
  );
}
