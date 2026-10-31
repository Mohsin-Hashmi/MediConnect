import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfilePageSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading doctor profile"
      className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]"
    >
      <span className="sr-only">Loading doctor profile</span>
      <div className="space-y-5">
        {[0, 1, 2].map((card) => (
          <Card key={card} className="gap-0 py-0 shadow-sm ring-slate-200/90">
            <CardHeader className="space-y-2 border-b px-5 py-5 sm:px-6">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-4 w-72 max-w-full" />
            </CardHeader>
            <CardContent className="grid gap-5 px-5 py-5 sm:grid-cols-2 sm:px-6">
              <Skeleton className="h-18 rounded-lg" />
              <Skeleton className="h-18 rounded-lg" />
              <Skeleton className="h-18 rounded-lg" />
              <Skeleton className="h-18 rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="space-y-5">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  );
}
