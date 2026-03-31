import { Skeleton } from "@/components/ui/skeleton";

export default function DepartmentGridSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden">
      {/* Image area skeleton */}
      <div className="aspect-[4/3]">
        <Skeleton className="w-full h-full rounded-none" />
      </div>

      {/* White strip skeleton */}
      <div className="bg-white px-4 py-3">
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
