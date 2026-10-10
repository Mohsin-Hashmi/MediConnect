import {
  CalendarDays,
  UserRoundCheck,
  UserRoundPlus,
  UsersRound,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { PatientMetricsData } from "@/types/patient";

export function PatientMetrics({ metrics }: { metrics: PatientMetricsData }) {
  const items = [
    {
      label: "Total patients",
      value: metrics.total,
      detail: "Records in the directory",
      icon: UsersRound,
      color: "bg-blue-50 text-primary",
    },
    {
      label: "Active patients",
      value: metrics.active,
      detail: "Currently marked active",
      icon: UserRoundCheck,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Follow-ups due",
      value: metrics.upcoming,
      detail: "Within the next 7 days",
      icon: CalendarDays,
      color: "bg-amber-50 text-amber-700",
    },
    {
      label: "New registrations",
      value: metrics.recentlyRegistered,
      detail: "Within the past 30 days",
      icon: UserRoundPlus,
      color: "bg-indigo-50 text-indigo-600",
    },
  ];
  return (
    <section
      aria-label="Patient metrics"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {items.map(({ label, value, detail, icon: Icon, color }) => (
        <Card
          key={label}
          className="gap-0 border-0 py-0 shadow-sm ring-1 ring-slate-200/90"
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {label}
              </p>
              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${color}`}
              >
                <Icon className="size-4.5" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight tabular-nums">
              {value.toLocaleString()}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
