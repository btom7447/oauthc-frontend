import { Skeleton } from "@/components/ui/skeleton";

export default function LocationCardSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-6 py-8 first:pt-0 last:pb-0">
      {/* Image */}
      <Skeleton className="shrink-0 w-full md:w-64 h-44 rounded-xl" />

      {/* Content */}
      <div className="flex flex-col gap-3 justify-center flex-1">
        {/* Name */}
        <Skeleton className="h-5 w-56" />

        {/* Address line */}
        <div className="flex items-start gap-2">
          <Skeleton className="w-3.5 h-3.5 rounded-full shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1.5 flex-1">
            <Skeleton className="h-3 w-full max-w-sm" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>

        {/* Contact numbers */}
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </div>
  );
}
