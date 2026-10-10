import {
  CalendarCheck2,
  CalendarClock,
  CircleCheckBig,
  Clock3,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { APPOINTMENTS_DEMO_DATE } from "@/data/mock/appointments";
import type { AppointmentMetricsProps } from "@/types/appointment";

export function AppointmentMetrics({ appointments }: AppointmentMetricsProps) {
  const metrics = [
    {
      label: "Total appointments",
      value: appointments.length,
      note: "All appointment records",
      icon: CalendarCheck2,
      iconClass: "bg-blue-50 text-primary",
    },
    {
      label: "Upcoming",
      value: appointments.filter(
        (item) =>
          item.date >= APPOINTMENTS_DEMO_DATE &&
          (item.status === "confirmed" || item.status === "pending"),
      ).length,
      note: "Confirmed or awaiting review",
      icon: CalendarClock,
      iconClass: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Completed",
      value: appointments.filter((item) => item.status === "completed").length,
      note: "Finished consultations",
      icon: CircleCheckBig,
      iconClass: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Pending requests",
      value: appointments.filter((item) => item.status === "pending").length,
      note: "Need your review",
      icon: Clock3,
      iconClass: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <section
      aria-label="Appointment metrics"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {metrics.map(({ label, value, note, icon: Icon, iconClass }) => (
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
                className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
              >
                <Icon className="size-4.5" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight tabular-nums">
              {value}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{note}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
