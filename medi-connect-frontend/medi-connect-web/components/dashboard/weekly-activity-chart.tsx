"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { WeeklyAppointmentActivity } from "@/types/doctor-dashboard";

const chartConfig = {
  completed: { label: "Completed", color: "var(--chart-1)" },
  confirmed: { label: "Confirmed", color: "#93c5fd" },
  cancelled: { label: "Cancelled", color: "#f59e0b" },
} satisfies ChartConfig;

export function WeeklyActivityChart({
  activity,
}: {
  activity: WeeklyAppointmentActivity[];
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className="h-64 min-h-64 w-full aspect-auto sm:h-72"
      role="img"
      aria-label="Sample weekly appointment counts by day for completed, confirmed, and cancelled visits"
    >
      <BarChart accessibilityLayer data={activity} margin={{ top: 12, right: 4, bottom: 4, left: -24 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={9} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="completed" fill="var(--color-completed)" radius={[4, 4, 0, 0]} maxBarSize={18} />
        <Bar dataKey="confirmed" fill="var(--color-confirmed)" radius={[4, 4, 0, 0]} maxBarSize={18} />
        <Bar dataKey="cancelled" fill="var(--color-cancelled)" radius={[4, 4, 0, 0]} maxBarSize={18} />
      </BarChart>
    </ChartContainer>
  );
}
