import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { WeeklyActivityChart } from "@/components/dashboard/doctor-dashboard/overview/weekly-activity-chart";
import type { DashboardActivityPanelsProps } from "@/types/doctor-dashboard";

const availabilityClasses = {
  "In-clinic": "bg-teal-50 text-teal-700 ring-teal-200",
  Telehealth: "bg-blue-50 text-blue-700 ring-blue-200",
  Hybrid: "bg-violet-50 text-violet-700 ring-violet-200",
} as const;

export function DashboardActivityPanels({
  data,
}: DashboardActivityPanelsProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(19rem,1fr)]">
      <Card className="min-w-0 gap-0 border-0 py-0 shadow-sm ring-1 ring-slate-200/90">
        <CardHeader className="px-5 pt-5 pb-2">
          <CardTitle className="font-semibold">Weekly Overview</CardTitle>
          <CardDescription className="text-xs">Sample appointments by status</CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-5 sm:px-5">
          <WeeklyActivityChart activity={data.weeklyActivity} />
        </CardContent>
      </Card>

      <Card className="min-w-0 gap-0 border-0 py-0 shadow-sm ring-1 ring-slate-200/90">
        <CardHeader className="px-5 pt-5 pb-4">
          <CardTitle className="font-semibold">Schedule &amp; Cohort</CardTitle>
          <CardDescription className="text-xs">Sample patient mix and weekly availability</CardDescription>
          <CardAction className="self-center">
            <Link href="/dashboard/availability" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              Manage
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="flex items-center justify-between gap-3 text-xs font-medium">
            <span>Patient cohort</span>
            <span className="text-muted-foreground tabular-nums">
              {data.patientCohort.newPatientsPercent}% new | {data.patientCohort.returningPatientsPercent}% returning
            </span>
          </div>
          <Progress
            value={data.patientCohort.newPatientsPercent}
            aria-label={`${data.patientCohort.newPatientsPercent}% new patients`}
            className="mt-2 gap-0 [&_[data-slot=progress-track]]:h-2"
          />

          <p className="mt-6 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Current week availability
          </p>
          <div className="mt-3 space-y-2">
            {data.availability.map((slot) => (
              <div key={slot.day} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-xs">
                <span className="font-semibold text-foreground">{slot.day}</span>
                <span className="text-muted-foreground">{slot.hours}</span>
                <Badge variant="outline" className={`h-6 border-0 px-2 text-[11px] ring-1 ${availabilityClasses[slot.mode]}`}>
                  {slot.mode}
                </Badge>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t pt-4">
            <Link href="/dashboard/availability" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              Manage availability
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
