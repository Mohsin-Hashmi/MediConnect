import {
  MessageSquareText,
  MessagesSquare,
  Star,
  ThumbsUp,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/dashboard/reviews/star-rating";
import type { ReviewMetricsProps } from "@/types/review";

export function ReviewMetrics({ metrics }: ReviewMetricsProps) {
  const items = [
    {
      label: "Average rating",
      value: metrics.averageRating.toFixed(1),
      helper: <StarRating rating={metrics.averageRating} />,
      icon: Star,
      tone: "bg-amber-50 text-amber-600",
    },
    {
      label: "Total reviews",
      value: metrics.totalReviews.toLocaleString(),
      helper: "Submitted patient feedback",
      icon: MessageSquareText,
      tone: "bg-blue-50 text-blue-600",
    },
    {
      label: "Positive ratings",
      value: `${Math.round(metrics.positivePercentage)}%`,
      helper: "Reviews rated 4 or 5 stars",
      icon: ThumbsUp,
      tone: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Awaiting response",
      value: metrics.unansweredReviews.toLocaleString(),
      helper: "Reviews without a reply",
      icon: MessagesSquare,
      tone: "bg-violet-50 text-violet-600",
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
              {value}
            </p>
            <div className="mt-1 text-xs text-muted-foreground">{helper}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
