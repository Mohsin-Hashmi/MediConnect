import { Search, SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PatientFilterBarProps, PatientFilters as PatientFilterValues } from "@/types/patient";

export function PatientFilters({ filters, onChange, onReset }: PatientFilterBarProps) {
  const hasFilters = filters.search !== "" || filters.gender !== "all" || filters.ageGroup !== "all" || filters.status !== "all" || filters.sort !== "recent";
  return (
    <div className="grid gap-3 border-b px-5 py-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-[minmax(14rem,1fr)_11rem_11rem_11rem_11rem_auto]">
      <div className="relative md:col-span-2 xl:col-span-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
        <Input aria-label="Search patients" placeholder="Search name, patient ID, email or care focus..." value={filters.search} onChange={(event) => onChange({ search: event.target.value })} className="h-10 pl-9 text-sm" />
      </div>
      <Select items={{ all: "All genders", Female: "Female", Male: "Male", Other: "Other" }} value={filters.gender} onValueChange={(value) => onChange({ gender: (value ?? "all") as PatientFilterValues["gender"] })}>
        <SelectTrigger aria-label="Filter by gender" className="w-full bg-white px-2.5 text-sm data-[size=default]:h-10"><SelectValue /></SelectTrigger>
        <SelectContent align="start" alignItemWithTrigger={false}><SelectItem value="all">All genders</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Male">Male</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent>
      </Select>
      <Select items={{ all: "All ages", "under-18": "Under 18", "18-39": "18–39 years", "40-59": "40–59 years", "60-plus": "60+ years" }} value={filters.ageGroup} onValueChange={(value) => onChange({ ageGroup: (value ?? "all") as PatientFilterValues["ageGroup"] })}>
        <SelectTrigger aria-label="Filter by age" className="w-full bg-white px-2.5 text-sm data-[size=default]:h-10"><SelectValue /></SelectTrigger>
        <SelectContent align="start" alignItemWithTrigger={false}><SelectItem value="all">All ages</SelectItem><SelectItem value="under-18">Under 18</SelectItem><SelectItem value="18-39">18–39 years</SelectItem><SelectItem value="40-59">40–59 years</SelectItem><SelectItem value="60-plus">60+ years</SelectItem></SelectContent>
      </Select>
      <Select items={{ all: "All statuses", active: "Active", inactive: "Inactive" }} value={filters.status} onValueChange={(value) => onChange({ status: (value ?? "all") as PatientFilterValues["status"] })}>
        <SelectTrigger aria-label="Filter by status" className="w-full bg-white px-2.5 text-sm data-[size=default]:h-10"><SelectValue /></SelectTrigger>
        <SelectContent align="start" alignItemWithTrigger={false}><SelectItem value="all">All statuses</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent>
      </Select>
      <Select items={{ recent: "Recent visit", name: "Name A–Z", next: "Next appointment" }} value={filters.sort} onValueChange={(value) => onChange({ sort: (value ?? "recent") as PatientFilterValues["sort"] })}>
        <SelectTrigger aria-label="Sort patients" className="w-full bg-white px-2.5 text-sm data-[size=default]:h-10"><SlidersHorizontal className="size-4 text-muted-foreground" aria-hidden="true" /><SelectValue /></SelectTrigger>
        <SelectContent align="start" alignItemWithTrigger={false}><SelectItem value="recent">Recent visit</SelectItem><SelectItem value="name">Name A–Z</SelectItem><SelectItem value="next">Next appointment</SelectItem></SelectContent>
      </Select>
      {hasFilters ? <Button type="button" variant="ghost" className="h-10 px-3 text-sm" onClick={onReset}><X className="size-4" aria-hidden="true" />Clear</Button> : null}
    </div>
  );
}
