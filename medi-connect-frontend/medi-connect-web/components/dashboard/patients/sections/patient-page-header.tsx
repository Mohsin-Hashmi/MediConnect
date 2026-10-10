import { Plus } from "lucide-react";

import { PdfExportButton } from "@/components/common/pdf-export-button";
import { Button } from "@/components/ui/button";
import type { PatientPageHeaderProps } from "@/types/patient";

export function PatientPageHeader({ patients, onNewPatient }: PatientPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Patients</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse and manage patient records in one place.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <PdfExportButton
          title="Patient directory"
          subtitle={`${patients.length} records | Filters currently applied | Current directory view`}
          filename="mediconnect-patients"
          headers={["Patient ID", "Name", "Age", "Gender", "Care focus", "Last visit", "Next appointment", "Visits", "Status"]}
          rows={patients.map((patient) => [
            patient.id,
            patient.name,
            String(patient.age),
            patient.gender,
            patient.careFocus,
            patient.lastVisitDate ?? "-",
            patient.nextAppointmentDate ?? "-",
            String(patient.visitCount),
            patient.status,
          ])}
          label="Export patients"
          className="h-10 gap-2 px-4 text-sm"
        />
        <Button type="button" className="h-10 gap-2 px-4 text-sm" onClick={onNewPatient}>
          <Plus className="size-4" aria-hidden="true" />New patient
        </Button>
      </div>
    </div>
  );
}
