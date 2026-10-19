import { DataSectionHeader } from "@/components/common/data-section-header";
import type { AppointmentScheduleHeaderProps } from "@/types/appointment";

export function AppointmentScheduleHeader({
  matchingCount,
}: AppointmentScheduleHeaderProps) {
  return (
    <DataSectionHeader
      title="Appointment schedule"
      description="Patient-booked consultations assigned to you"
      countLabel={`${matchingCount} matching appointments`}
    />
  );
}
