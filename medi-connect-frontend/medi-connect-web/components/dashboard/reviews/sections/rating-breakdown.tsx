import { Star } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { RatingBreakdownProps } from "@/types/review";

export function RatingBreakdown({
  distribution,
  totalReviews,
}: RatingBreakdownProps) {
  return (
    <Card className="gap-0 border-0 py-0 shadow-sm ring-1 ring-slate-200/90">
      <CardHeader className="border-b px-5 py-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="font-semibold">Rating breakdown</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Distribution across all feedback in this preview.
            </p>
          </div>
          <span className="text-sm text-muted-foreground">
            {totalReviews} total reviews
          </span>
        </div>
      </CardHeader>
      <CardContent className="grid gap-x-8 gap-y-3 px-5 py-5 lg:grid-cols-2">
        {distribution.map((item) => (
          <div
            key={item.rating}
            className="grid grid-cols-[3rem_1fr_4.5rem] items-center gap-3"
          >
            <span className="flex items-center gap-1 font-medium tabular-nums">
              {item.rating}
              <Star
                className="size-3.5 fill-amber-400 text-amber-400"
                aria-hidden="true"
              />
            </span>
            <Progress value={item.percentage} className="h-2" />
            <span className="text-right text-xs tabular-nums text-muted-foreground">
              {Math.round(item.percentage)}% · {item.count}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
