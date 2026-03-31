import { Skeleton } from "@/components/ui/skeleton";

export default function DoctorCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      {/* Top row: avatar + details */}
      <div className="flex gap-4">
        <Skeleton className="w-20 h-20 rounded-full shrink-0" />

        <div className="flex flex-col gap-1.5 flex-1 min-w-0 pt-1">
          {/* Name */}
          <Skeleton className="h-4 w-40" />
          {/* Specialty */}
          <Skeleton className="h-3 w-28" />
          {/* Experience */}
          <Skeleton className="h-3 w-20" />
          {/* Languages */}
          <Skeleton className="h-3 w-32" />
        </div>
      </div>

      <hr className="border-gray-100 my-2" />

      {/* Bottom: center + qualifications */}
      <div className="flex flex-col gap-1">
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-3 w-36" />
      </div>
    </div>
  );
}
