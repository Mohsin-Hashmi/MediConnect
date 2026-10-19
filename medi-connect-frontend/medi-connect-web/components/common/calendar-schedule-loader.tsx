import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const weekdays = Array.from({ length: 7 });
const timeRows = Array.from({ length: 8 });
const monthDays = Array.from({ length: 35 });

export function CalendarScheduleLoader() {
  return (
    <div
      role="status"
      aria-label="Loading calendar and schedule"
      className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_19rem]"
    >
      <span className="sr-only">Loading calendar and schedule...</span>

      <Card className="min-w-0 gap-0 overflow-hidden border-0 bg-white py-0 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 xl:flex-row xl:items-center xl:justify-between xl:px-5">
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-10 w-18 rounded-lg" />
            <Skeleton className="h-10 w-20 rounded-lg" />
            <div className="flex items-center gap-2.5 sm:border-l sm:border-slate-200 sm:pl-3">
              <Skeleton className="size-9 rounded-lg" />
              <Skeleton className="h-5 w-48" />
            </div>
          </div>
          <Skeleton className="h-10 w-48 rounded-lg" />
        </div>

        <CardContent className="overflow-hidden px-0">
          <div className="overflow-hidden">
            <div className="min-w-180">
              <div className="grid grid-cols-[4rem_repeat(7,minmax(6rem,1fr))] border-b border-slate-200 bg-white">
                <div className="h-16 border-r border-slate-200" />
                {weekdays.map((_, index) => (
                  <div
                    key={index}
                    className="flex h-16 flex-col items-center justify-center gap-2 border-r border-slate-100"
                  >
                    <Skeleton className="h-2.5 w-7" />
                    <Skeleton className="size-7 rounded-full" />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-[4rem_repeat(7,minmax(6rem,1fr))]">
                <div className="bg-slate-50/60">
                  {timeRows.map((_, index) => (
                    <div
                      key={index}
                      className="flex h-16 justify-end border-r border-b border-slate-100 px-2 pt-2"
                    >
                      <Skeleton className="h-2.5 w-9" />
                    </div>
                  ))}
                </div>
                {weekdays.map((_, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="relative border-r border-slate-100"
                  >
                    {timeRows.map((__, rowIndex) => (
                      <div
                        key={rowIndex}
                        className="h-16 border-b border-slate-100"
                      />
                    ))}
                    {dayIndex === 1 || dayIndex === 3 || dayIndex === 5 ? (
                      <Skeleton
                        className={`absolute inset-x-2 h-14 rounded-md ${dayIndex === 1 ? "top-18" : dayIndex === 3 ? "top-50" : "top-34"}`}
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <div className="flex gap-4 border-t border-slate-200 px-4 py-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </Card>

      <aside className="space-y-4" aria-hidden="true">
        <Card className="gap-0 border-0 bg-white py-0 shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <Skeleton className="h-5 w-28" />
              <div className="flex gap-2">
                <Skeleton className="size-7 rounded-md" />
                <Skeleton className="size-7 rounded-md" />
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {weekdays.map((_, index) => (
                <Skeleton
                  key={`weekday-${index}`}
                  className="mx-auto h-2.5 w-5"
                />
              ))}
              {monthDays.map((_, index) => (
                <Skeleton
                  key={`day-${index}`}
                  className="mx-auto size-6 rounded-full"
                />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="gap-0 border-0 bg-white py-0 shadow-sm ring-1 ring-slate-200">
          <CardHeader className="space-y-2 border-b border-slate-100 py-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-36" />
          </CardHeader>
          <CardContent className="space-y-3 py-4">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-lg" />
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
