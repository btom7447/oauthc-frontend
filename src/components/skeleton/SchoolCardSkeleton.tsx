import { Skeleton } from "@/components/ui/skeleton";

export default function SchoolCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden">
      {/* Image area */}
      <div className="aspect-[4/3]">
        <Skeleton className="w-full h-full rounded-none" />
      </div>

      {/* White strip */}
      <div className="bg-white px-4 py-3 flex flex-col gap-1.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
