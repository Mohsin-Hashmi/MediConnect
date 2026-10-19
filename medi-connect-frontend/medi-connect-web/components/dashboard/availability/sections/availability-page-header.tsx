import { Plus } from "lucide-react";

import { DashboardPageHeader } from "@/components/common/dashboard-page-header";
import { PdfExportButton } from "@/components/common/pdf-export-button";
import { Button } from "@/components/ui/button";
import type { AvailabilityPageHeaderProps } from "@/types/availability";

export function AvailabilityPageHeader({
  availabilities,
  onAdd,
}: AvailabilityPageHeaderProps) {
  return (
    <DashboardPageHeader
      title="Availability"
      description="Publish and manage consultation windows patients can book."
      actions={
        <>
          <PdfExportButton
            title="MediConnect availability schedule"
            subtitle={`${availabilities.length} availability windows | Filters currently applied`}
            filename="mediconnect-availability-schedule.pdf"
            label="Export schedule"
            headers={["Date", "Time window", "Slot duration", "Status"]}
            rows={availabilities.map((item) => [
              item.date,
              `${item.startTime} - ${item.endTime}`,
              `${item.slotDuration} minutes`,
              item.isAvailable ? "Available" : "Paused",
            ])}
            className="h-10 gap-2 px-4 text-sm"
          />
          <Button
            type="button"
            className="h-10 gap-2 px-4 text-sm"
            onClick={onAdd}
          >
            <Plus className="size-4" />
            Add availability
          </Button>
        </>
      }
    />
  );
}
