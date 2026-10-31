import { DashboardPageHeader } from "@/components/common/dashboard-page-header";
import { PdfExportButton } from "@/components/common/pdf-export-button";
import { getPatientAge } from "@/lib/appointment-format";
import type { PatientPageHeaderProps } from "@/types/patient";

export function PatientPageHeader({ patients }: PatientPageHeaderProps) {
  return (
    <DashboardPageHeader
      title="Patients"
      description="View patients connected to your practice through appointments."
      actions={
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
            patient.patient.id,
            patient.patient.name,
            getPatientAge(patient.patient.dateOfBirth)?.toString() ?? "",
            patient.patient.gender ?? "",
            patient.patient.email ?? "",
            patient.appointmentSummary.latest.date,
            patient.appointmentSummary.total.toString(),
          ])}
          label="Export patients"
          className="h-10 px-4 text-sm"
        />
      }
    />
  );
}
