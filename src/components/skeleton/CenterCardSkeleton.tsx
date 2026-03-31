import { Skeleton } from "@/components/ui/skeleton";

export function CenterCardSkeleton() {
  return (
    <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-gray-200">
      <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
      {/* Simulated bottom overlay text */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2">
        <Skeleton className="h-5 w-3/4 bg-white/20" />
        <Skeleton className="h-3 w-1/2 bg-white/20" />
      </div>
    </div>
  );
}
