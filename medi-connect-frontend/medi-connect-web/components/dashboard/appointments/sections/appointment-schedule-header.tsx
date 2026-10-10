import { CalendarDays } from "lucide-react";

import { CardHeader, CardTitle } from "@/components/ui/card";
import { APPOINTMENTS_DEMO_DATE } from "@/data/mock/appointments";
import { formatAppointmentDate } from "@/lib/appointment-format";
import type { AppointmentScheduleHeaderProps } from "@/types/appointment";

export function AppointmentScheduleHeader({
  matchingCount,
}: AppointmentScheduleHeaderProps) {
  return (
    <CardHeader className="gap-0 border-b px-5 py-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle className="font-semibold">Appointment schedule</CardTitle>
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            Sample day: {formatAppointmentDate(APPOINTMENTS_DEMO_DATE)}
          </p>
        </div>
        <span className="text-sm text-muted-foreground">
          {matchingCount} matching appointments
        </span>
      </div>
    </CardHeader>
  );
}
