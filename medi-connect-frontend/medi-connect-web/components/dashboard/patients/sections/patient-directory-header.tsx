import { CalendarDays } from "lucide-react";

import { CardHeader, CardTitle } from "@/components/ui/card";
import { PATIENTS_REFERENCE_DATE } from "@/data/mock/patients";
import { formatAppointmentDate } from "@/lib/appointment-format";
import type { PatientDirectoryHeaderProps } from "@/types/patient";

export function PatientDirectoryHeader({ matchingCount }: PatientDirectoryHeaderProps) {
  return (
    <CardHeader className="gap-0 border-b px-5 py-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle className="font-semibold">Patient directory</CardTitle>
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            As of {formatAppointmentDate(PATIENTS_REFERENCE_DATE)} · Records are read-only until API integration
          </p>
        </div>
        <span className="text-sm text-muted-foreground">{matchingCount} matching patients</span>
      </div>
    </CardHeader>
  );
}
