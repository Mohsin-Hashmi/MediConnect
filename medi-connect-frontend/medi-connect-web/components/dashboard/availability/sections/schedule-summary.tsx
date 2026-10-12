import { Building2, CalendarOff, CalendarRange, Clock3, Globe2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWeeklyCapacity } from "@/lib/availability-schedule";
import type { AvailabilityValues } from "@/types/availability";

export function ScheduleSummary({ values }: { values: AvailabilityValues }) {
  const activeDays = values.days.filter((day) => day.enabled).length;
  const capacity = getWeeklyCapacity(values);
  return (
    <Card className="gap-0 border border-slate-200 border-t-4 border-t-primary bg-white py-0 shadow-sm">
      <CardHeader className="px-5 py-5"><CardTitle className="text-base font-semibold">Schedule at a glance</CardTitle><p className="text-sm text-muted-foreground">Calculated from the current draft.</p></CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 border-t border-slate-100 px-5 py-5">
        <div className="rounded-xl bg-blue-50 p-3"><CalendarRange className="size-5 text-primary" aria-hidden="true" /><p className="mt-2 text-2xl font-bold text-slate-900">{capacity}</p><p className="text-sm text-slate-600">Potential weekly slots</p></div>
        <div className="rounded-xl bg-slate-50 p-3"><Clock3 className="size-5 text-slate-600" aria-hidden="true" /><p className="mt-2 text-2xl font-bold text-slate-900">{activeDays}</p><p className="text-sm text-slate-600">Working days</p></div>
        <div className="flex items-center gap-2 text-sm text-slate-600"><CalendarOff className="size-4 shrink-0 text-amber-600" aria-hidden="true" />{values.blocks.length} blocked dates</div>
        <div className="flex items-center gap-2 text-sm text-slate-600"><Globe2 className="size-4 shrink-0 text-primary" aria-hidden="true" />PKT (UTC+05:00)</div>
        <p className="col-span-2 text-sm leading-relaxed text-muted-foreground">Capacity is an estimate, not a live booking count. It excludes blocked dates and existing appointments.</p>
        <p className="col-span-2 flex items-start gap-2 border-t border-slate-100 pt-3 text-sm text-muted-foreground"><Building2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" /><span><strong className="block font-medium text-slate-800">{values.clinicName}</strong>In-person consultation location</span></p>
      </CardContent>
    </Card>
  );
}
