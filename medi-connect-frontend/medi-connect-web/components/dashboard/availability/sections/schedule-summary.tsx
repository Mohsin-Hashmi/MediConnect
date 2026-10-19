import {
  CalendarCheck2,
  CalendarDays,
  Clock3,
  PauseCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { AvailabilityRecord } from "@/types/availability";

function minutes(time: string) {
  const [hours, mins] = time.split(":").map(Number);
  return hours * 60 + mins;
}

export function ScheduleSummary({
  availabilities,
}: {
  availabilities: AvailabilityRecord[];
}) {
  const active = availabilities.filter((item) => item.isAvailable);
  const days = new Set(active.map((item) => item.date.slice(0, 10))).size;
  const slots = active.reduce(
    (total, item) =>
      total +
      Math.floor(
        (minutes(item.endTime) - minutes(item.startTime)) / item.slotDuration,
      ),
    0,
  );
  const items = [
    {
      label: "Published windows",
      value: active.length,
      note: "Currently accepting bookings",
      icon: CalendarCheck2,
      color: "bg-blue-50 text-primary",
    },
    {
      label: "Available dates",
      value: days,
      note: "Distinct bookable dates",
      icon: CalendarDays,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Potential slots",
      value: slots,
      note: "Calculated from window duration",
      icon: Clock3,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Paused windows",
      value: availabilities.length - active.length,
      note: "Not accepting bookings",
      icon: PauseCircle,
      color: "bg-amber-50 text-amber-700",
    },
  ];
  return (
    <section
      aria-label="Availability summary"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {items.map(({ label, value, note, icon: Icon, color }) => (
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
                <Icon className="size-4.5" />
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
