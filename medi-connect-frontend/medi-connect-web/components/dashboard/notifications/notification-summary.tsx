import { Bell, CalendarClock, CircleAlert, MailOpen } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { NotificationMetricsProps } from "@/types/notification";

export function NotificationSummary({ metrics }: NotificationMetricsProps) {
  const items = [
    {
      label: "Total activity",
      value: metrics.total,
      helper: "All preview notifications",
      icon: Bell,
      tone: "bg-blue-50 text-blue-600",
    },
    {
      label: "Unread",
      value: metrics.unread,
      helper: "Updates not yet reviewed",
      icon: MailOpen,
      tone: "bg-violet-50 text-violet-600",
    },
    {
      label: "Needs attention",
      value: metrics.attention,
      helper: "Time-sensitive activity",
      icon: CircleAlert,
      tone: "bg-amber-50 text-amber-600",
    },
    {
      label: "Last 7 days",
      value: metrics.thisWeek,
      helper: "Recent workspace activity",
      icon: CalendarClock,
      tone: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(({ label, value, helper, icon: Icon, tone }) => (
        <Card
          key={label}
          className="border-0 py-0 shadow-sm ring-1 ring-slate-200/90"
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {label}
              </p>
              <span
                className={`flex size-10 items-center justify-center rounded-xl ${tone}`}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight tabular-nums">
              {value.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
