import { PdfExportButton } from "@/components/common/pdf-export-button";
import type { PatientPageHeaderProps } from "@/types/patient";

export function PatientPageHeader({ patients }: PatientPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Patients
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View patients connected to your practice through appointments.
        </p>
      </div>
      <PdfExportButton
        title="Patient directory"
        subtitle={`${patients.length} patients in the current view`}
        filename="mediconnect-patients"
        headers={[
          "Patient ID",
          "Name",
          "Age",
          "Gender",
          "Email",
          "Latest appointment",
          "Appointments",
        ]}
        rows={patients.map((patient) => [
          patient.id,
          patient.name,
          patient.age?.toString() ?? "",
          patient.gender ?? "",
          patient.email ?? "",
          patient.latestAppointmentDate,
          patient.appointmentCount.toString(),
        ])}
        label="Export patients"
        className="h-10 px-4 text-sm"
      />
    </div>
  );
}
