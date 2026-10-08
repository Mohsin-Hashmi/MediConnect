import {
  BadgeCheck,
  CalendarCheck2,
  CalendarClock,
  UsersRound,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { DashboardMetricsProps } from "@/types/doctor-dashboard";
import { getMockDashboardMetrics } from "@/data/mock/doctor-dashboard";

export function DashboardMetrics({ data }: DashboardMetricsProps) {
  const metrics = getMockDashboardMetrics(data);
  const cards = [
    {
      label: "Today's appointments",
      value: metrics.todayAppointments.toString(),
      note: "Scheduled in the sample day",
      icon: CalendarCheck2,
      iconClass: "bg-blue-50 text-primary",
    },
    {
      label: "Upcoming appointments",
      value: metrics.upcomingAppointments.toString(),
      note: "Across the sample schedule",
      icon: CalendarClock,
      iconClass: "bg-violet-50 text-violet-600",
    },
    {
      label: "Total patients",
      value: metrics.totalPatients.toLocaleString("en-US"),
      note: "In the sample practice",
      icon: UsersRound,
      iconClass: "bg-teal-50 text-secondary",
    },
    {
      label: "Completion rate",
      value: `${metrics.completionRate.toFixed(1)}%`,
      note: "Completed vs. cancelled this week",
      icon: BadgeCheck,
      iconClass: "bg-indigo-50 text-indigo-600",
    },
  ];

  return (
    <section aria-label="Practice overview metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value, note, icon: Icon, iconClass }) => (
        <Card key={label} className="gap-0 border-0 py-0 shadow-sm ring-1 ring-slate-200/90">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {label}
              </p>
              <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
                <Icon className="size-4.5" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight text-foreground tabular-nums">
              {value}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{note}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
