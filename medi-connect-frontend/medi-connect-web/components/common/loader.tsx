import { Skeleton } from "@/components/ui/skeleton";
import type { LoaderProps } from "@/types/common";

export function Loader({ label = "Loading table data...", rows = 5 }: LoaderProps) {
  return (
    <div role="status" aria-label={label} className="space-y-3 px-5 py-5">
      <span className="sr-only">{label}</span>
      {Array.from({ length: Math.max(1, Math.min(rows, 10)) }, (_, index) => (
        <div key={index} className="flex items-center gap-4 rounded-lg border border-border/60 px-4 py-3" aria-hidden="true">
          <Skeleton className="size-9 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="hidden h-5 w-20 sm:block" />
        </div>
      ))}
    </div>
  );
}
