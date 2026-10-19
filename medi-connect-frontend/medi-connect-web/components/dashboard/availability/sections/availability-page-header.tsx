import { Plus } from "lucide-react";

import { PdfExportButton } from "@/components/common/pdf-export-button";
import { Button } from "@/components/ui/button";
import type { AvailabilityPageHeaderProps } from "@/types/availability";

export function AvailabilityPageHeader({
  availabilities,
  onAdd,
}: AvailabilityPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Availability
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Publish and manage consultation windows patients can book.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
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
      </div>
    </div>
  );
}
