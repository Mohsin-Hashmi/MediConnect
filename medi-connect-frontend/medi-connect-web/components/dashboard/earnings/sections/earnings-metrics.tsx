import {
  BadgeDollarSign,
  CircleCheckBig,
  Clock3,
  WalletCards,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatPkr } from "@/lib/earnings";
import type { EarningsMetricsProps } from "@/types/earnings";

export function EarningsMetrics({ metrics }: EarningsMetricsProps) {
  const items = [
    {
      label: "Total revenue",
      value: formatPkr(metrics.totalRevenue),
      helper: "Excludes refunded consultations",
      icon: BadgeDollarSign,
      tone: "bg-blue-50 text-blue-600",
    },
    {
      label: "Completed consultations",
      value: metrics.completedConsultations.toLocaleString(),
      helper: "Revenue-bearing consultations",
      icon: CircleCheckBig,
      tone: "bg-violet-50 text-violet-600",
    },
    {
      label: "Available for payout",
      value: formatPkr(metrics.availableForPayout),
      helper: "Settled preview balance",
      icon: WalletCards,
      tone: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Pending clearance",
      value: formatPkr(metrics.pendingClearance),
      helper: "Awaiting settlement",
      icon: Clock3,
      tone: "bg-amber-50 text-amber-600",
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
                <Icon className="size-5" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight tabular-nums">
              {value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
