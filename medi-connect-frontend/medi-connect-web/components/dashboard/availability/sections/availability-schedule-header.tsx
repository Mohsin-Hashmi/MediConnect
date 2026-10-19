import { CardHeader, CardTitle } from "@/components/ui/card";
import type { AvailabilityScheduleHeaderProps } from "@/types/availability";

export function AvailabilityScheduleHeader({
  matchingCount,
}: AvailabilityScheduleHeaderProps) {
  return (
    <CardHeader className="gap-0 border-b px-5 py-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle className="font-semibold">Availability schedule</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Bookable windows shown in PKT (UTC+05:00)
          </p>
        </div>
        <span className="text-sm text-muted-foreground">
          {matchingCount} matching windows
        </span>
      </div>
    </CardHeader>
  );
}
