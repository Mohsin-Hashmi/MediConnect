import { DashboardPageHeader } from "@/components/common/dashboard-page-header";
import { PdfExportButton } from "@/components/common/pdf-export-button";
import {
  formatAppointmentDate,
  formatAppointmentTime,
} from "@/lib/appointment-format";
import type { AppointmentPageHeaderProps } from "@/types/appointment";

export function AppointmentPageHeader({
  appointments,
}: AppointmentPageHeaderProps) {
  return (
    <DashboardPageHeader
      title="Appointments"
      description="Manage your schedule and review patient consultations."
      actions={
        <PdfExportButton
          title="MediConnect appointment schedule"
          subtitle={`${appointments.length} appointments | Filters currently applied`}
          filename="mediconnect-appointments-schedule.pdf"
          label="Export schedule"
          headers={["Date & time", "Patient", "Reason", "Status"]}
          rows={appointments.map((item) => [
            `${formatAppointmentDate(item.appointment.date)} ${formatAppointmentTime(item.appointment.startTime)}`,
            item.patient?.name ?? "Patient unavailable",
            item.appointment.reason?.trim() || "No reason provided",
            item.appointment.status,
          ])}
          className="h-10 gap-2 px-4 text-sm"
        />
      }
    />
  );
}
