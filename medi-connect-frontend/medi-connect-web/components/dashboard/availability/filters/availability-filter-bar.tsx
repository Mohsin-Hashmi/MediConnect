import { Search, SlidersHorizontal, X } from "lucide-react";

import { AvailabilityDateFilter } from "@/components/dashboard/availability/filters/availability-date-filter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AvailabilityFilterBarProps, AvailabilitySortOrder, AvailabilityStatusFilter } from "@/types/availability";

export function AvailabilityFilterBar({ filters, onChange, onReset, hasFilters }: AvailabilityFilterBarProps) {
  return <div className="grid gap-3 border-b px-5 py-4 md:grid-cols-2 2xl:grid-cols-[minmax(14rem,1fr)_11rem_11rem_11rem_auto]">
    <div className="relative md:col-span-2 xl:col-span-1"><Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search availability" placeholder="Search window ID, time or duration..." value={filters.search} onChange={(event) => onChange({ search: event.target.value })} className="h-10 pl-9 text-sm" /></div>
    <AvailabilityDateFilter date={filters.date} onDateChange={(date) => onChange({ date })} />
    <Select items={{ all: "All statuses", available: "Available", paused: "Paused" }} value={filters.status} onValueChange={(value) => onChange({ status: (value ?? "all") as AvailabilityStatusFilter })}><SelectTrigger aria-label="Filter by status" className="w-full bg-white px-2.5 text-sm data-[size=default]:h-10"><SelectValue /></SelectTrigger><SelectContent align="start" alignItemWithTrigger={false}><SelectItem value="all">All statuses</SelectItem><SelectItem value="available">Available</SelectItem><SelectItem value="paused">Paused</SelectItem></SelectContent></Select>
    <Select items={{ schedule: "Schedule order", oldest: "Oldest first", newest: "Newest first" }} value={filters.sort} onValueChange={(value) => onChange({ sort: (value ?? "schedule") as AvailabilitySortOrder })}><SelectTrigger aria-label="Sort availability" className="w-full bg-white px-2.5 text-sm data-[size=default]:h-10"><SlidersHorizontal className="size-4 text-muted-foreground" /><SelectValue /></SelectTrigger><SelectContent align="start" alignItemWithTrigger={false}><SelectItem value="schedule">Schedule order</SelectItem><SelectItem value="oldest">Oldest first</SelectItem><SelectItem value="newest">Newest first</SelectItem></SelectContent></Select>
    {hasFilters ? <Button type="button" variant="ghost" className="h-10 px-3 text-sm" onClick={onReset}><X className="size-4" />Clear</Button> : null}
  </div>;
}
