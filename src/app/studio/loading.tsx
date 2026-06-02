import { Skeleton } from "@/components/ui/skeleton";

export default function StudioLoading() {
  return (
    <div className="section-shell py-8">
      <Skeleton className="mb-2 h-7 w-48" />
      <Skeleton className="mb-6 h-4 w-64" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-card" />
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-64 w-full rounded-card" />
        <Skeleton className="h-64 w-full rounded-card" />
      </div>
    </div>
  );
}
