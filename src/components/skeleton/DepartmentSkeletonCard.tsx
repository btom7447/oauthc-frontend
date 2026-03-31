import { Skeleton } from "@/components/ui/skeleton";

export function DepartmentSkeletonCards() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-gray-200 px-5 py-10 text-center">
      {/* Icon */}
      <Skeleton className="w-9 h-9 rounded-full" />
      {/* Name */}
      <Skeleton className="h-4 w-28" />
    </div>
  );
}
