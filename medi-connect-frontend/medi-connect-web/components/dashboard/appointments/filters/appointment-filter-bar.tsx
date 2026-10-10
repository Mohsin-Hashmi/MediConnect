import { Search, SlidersHorizontal, X } from "lucide-react";

import { AppointmentDateFilter } from "@/components/dashboard/appointments/filters/appointment-date-filter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  AppointmentFilterBarProps,
  AppointmentSortOrder,
  AppointmentStatus,
  AppointmentVisitType,
} from "@/types/appointment";

export function AppointmentFilterBar({
  filters,
  onChange,
  onReset,
  hasFilters,
}: AppointmentFilterBarProps) {
  return (
    <div className="grid gap-3 border-b px-5 py-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-[minmax(14rem,1fr)_11rem_11rem_11rem_11rem_auto]">
      <div className="relative md:col-span-2 xl:col-span-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          aria-label="Search appointments"
          placeholder="Search patient, booking ID or reason..."
          value={filters.search}
          onChange={(event) => onChange({ search: event.target.value })}
          className="h-10 pl-9 text-sm"
        />
      </div>
      <AppointmentDateFilter date={filters.date} onDateChange={(date) => onChange({ date })} />
      <Select
        items={{
          all: "All visit types",
          Video: "Video",
          "In-person": "In-person",
        }}
        value={filters.visitType}
        onValueChange={(value) =>
          onChange({
            visitType: (value ?? "all") as "all" | AppointmentVisitType,
          })
        }
      >
        <SelectTrigger
          aria-label="Filter by visit type"
          className="w-full bg-white px-2.5 text-sm data-[size=default]:h-10"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="start" alignItemWithTrigger={false}>
          <SelectItem value="all">All visit types</SelectItem>
          <SelectItem value="Video">Video</SelectItem>
          <SelectItem value="In-person">In-person</SelectItem>
        </SelectContent>
      </Select>
      <Select
        items={{
          all: "All statuses",
          confirmed: "Confirmed",
          pending: "Pending",
          completed: "Completed",
          cancelled: "Cancelled",
        }}
        value={filters.status}
        onValueChange={(value) =>
          onChange({ status: (value ?? "all") as "all" | AppointmentStatus })
        }
      >
        <SelectTrigger
          aria-label="Filter by status"
          className="w-full bg-white px-2.5 text-sm data-[size=default]:h-10"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="start" alignItemWithTrigger={false}>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="confirmed">Confirmed</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
      <Select
        items={{
          schedule: "Schedule order",
          oldest: "Oldest first",
          newest: "Newest first",
        }}
        value={filters.sort}
        onValueChange={(value) =>
          onChange({ sort: (value ?? "schedule") as AppointmentSortOrder })
        }
      >
        <SelectTrigger
          aria-label="Sort appointments"
          className="w-full bg-white px-2.5 text-sm data-[size=default]:h-10"
        >
          <SlidersHorizontal
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="start" alignItemWithTrigger={false}>
          <SelectItem value="schedule">Schedule order</SelectItem>
          <SelectItem value="oldest">Oldest first</SelectItem>
          <SelectItem value="newest">Newest first</SelectItem>
        </SelectContent>
      </Select>
      {hasFilters && (
        <Button
          type="button"
          variant="ghost"
          onClick={onReset}
          className="h-10 px-3 text-sm"
        >
          <X className="size-4" aria-hidden="true" />
          Clear
        </Button>
      )}
    </div>
  );
}
