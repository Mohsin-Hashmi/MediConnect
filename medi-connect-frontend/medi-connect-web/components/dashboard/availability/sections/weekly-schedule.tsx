import { format, parseISO } from "date-fns";
import { Clock3 } from "lucide-react";

import { Error } from "@/components/common/error";
import { Loader } from "@/components/common/loader";
import { NoDataFound } from "@/components/common/no-data-found";
import { StatusBadge } from "@/components/common/status-badge";
import { AvailabilityActions } from "@/components/dashboard/availability/list/availability-actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AvailabilityScheduleProps } from "@/types/availability";

export function WeeklySchedule({
  availabilities,
  isLoading,
  error,
  onRetry,
  onEdit,
  onDelete,
  onResetFilters,
}: AvailabilityScheduleProps) {
  if (isLoading) return <Loader label="Loading availability..." />;
  if (error)
    return (
      <Error
        title="Could not load availability"
        message={error}
        onRetry={onRetry}
      />
    );
  if (availabilities.length === 0)
    return (
      <NoDataFound
        title="No availability found"
        description={
          onResetFilters
            ? "Try a different search or clear the current filters."
            : "Add your first dated availability window so patients can book."
        }
        actionLabel={onResetFilters ? "Clear filters" : undefined}
        onAction={onResetFilters}
      />
    );

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-slate-50/90">
          <TableRow>
            <TableHead className="pl-5">Date</TableHead>
            <TableHead>Time window</TableHead>
            <TableHead>Slot duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="pr-5 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {availabilities.map((availability) => (
              <TableRow key={availability.id}>
                <TableCell className="min-w-44 pl-5">
                  <p className="font-semibold">
                    {format(parseISO(availability.date), "EEEE")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(parseISO(availability.date), "d MMMM yyyy")}
                  </p>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-2 font-medium">
                    <Clock3 className="size-4 text-primary" />
                    {availability.startTime} - {availability.endTime}
                  </span>
                </TableCell>
                <TableCell>{availability.slotDuration} minutes</TableCell>
                <TableCell>
                  <StatusBadge
                    status={availability.isAvailable ? "Available" : "Paused"}
                    tone={availability.isAvailable ? "success" : "neutral"}
                  />
                </TableCell>
                <TableCell className="pr-5 text-right">
                  <AvailabilityActions
                    availability={availability}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
