import { CardHeader, CardTitle } from "@/components/ui/card";
import type { AppointmentScheduleHeaderProps } from "@/types/appointment";

export function AppointmentScheduleHeader({
  matchingCount,
}: AppointmentScheduleHeaderProps) {
  return (
    <CardHeader className="gap-0 border-b px-5 py-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle className="font-semibold">Appointment schedule</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Patient-booked consultations assigned to you
          </p>
        </div>
        <span className="text-sm text-muted-foreground">
          {matchingCount} matching appointments
        </span>
      </div>
    </CardHeader>
  );
}
