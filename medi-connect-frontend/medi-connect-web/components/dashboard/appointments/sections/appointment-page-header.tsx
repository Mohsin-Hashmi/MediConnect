import { PdfExportButton } from "@/components/common/pdf-export-button";
import {
  formatAppointmentDate,
  formatAppointmentFee,
  formatAppointmentTime,
} from "@/lib/appointment-format";
import type { AppointmentPageHeaderProps } from "@/types/appointment";

export function AppointmentPageHeader({
  appointments,
}: AppointmentPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Appointments
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your schedule and review patient consultations.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <PdfExportButton
          title="MediConnect appointment schedule"
          subtitle={`${appointments.length} appointments | Filters currently applied`}
          filename="mediconnect-appointments-schedule.pdf"
          label="Export schedule"
          headers={["Date & time", "Patient", "Reason", "Visit type", "Status", "Fee"]}
          rows={appointments.map((item) => [
            `${formatAppointmentDate(item.date)} ${formatAppointmentTime(item.time)}`,
            item.patientName,
            item.reason,
            item.visitType ?? "Not specified",
            item.status,
            item.feePkr === null ? "Not recorded" : formatAppointmentFee(item.feePkr),
          ])}
          className="h-10 gap-2 px-4 text-sm"
        />
      </div>
    </div>
  );
}
