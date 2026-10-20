"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatPkr } from "@/lib/earnings";
import type { RevenueOverviewProps } from "@/types/earnings";

const chartConfig = {
  gross: { label: "Gross revenue", color: "#93c5fd" },
  net: { label: "Net earnings", color: "#14b8a6" },
} satisfies ChartConfig;

export function RevenueOverview({ data }: RevenueOverviewProps) {
  return (
    <Card className="min-w-0 gap-0 py-0 shadow-sm ring-slate-200/90">
      <CardHeader className="border-b px-5 py-5">
        <CardTitle>Revenue overview</CardTitle>
        <CardDescription>
          Gross revenue compared with estimated net earnings.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 py-5 sm:px-5">
        <ChartContainer
          config={chartConfig}
          className="h-72 w-full aspect-auto"
          role="img"
          aria-label="Revenue by week"
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={64}
              tickFormatter={(value) => `${Number(value) / 1000}k`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className="flex min-w-36 items-center justify-between gap-4">
                      <span className="text-muted-foreground">
                        {chartConfig[name as keyof typeof chartConfig]?.label}
                      </span>
                      <span className="font-mono font-medium">
                        {formatPkr(Number(value))}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="gross"
              fill="var(--color-gross)"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
            <Bar
              dataKey="net"
              fill="var(--color-net)"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
