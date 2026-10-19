import { DataSectionHeader } from "@/components/common/data-section-header";
import type { AvailabilityScheduleHeaderProps } from "@/types/availability";

export function AvailabilityScheduleHeader({
  matchingCount,
}: AvailabilityScheduleHeaderProps) {
  return (
    <DataSectionHeader
      title="Availability schedule"
      description="Bookable windows shown in PKT (UTC+05:00)"
      countLabel={`${matchingCount} matching windows`}
    />
  );
}
