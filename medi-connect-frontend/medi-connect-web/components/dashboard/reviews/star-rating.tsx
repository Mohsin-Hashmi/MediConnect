import { Star } from "lucide-react";
import { cn } from "cn";

import type { StarRatingProps } from "@/types/review";

export function StarRating({
  rating,
  size = "sm",
  showValue = false,
  className,
}: StarRatingProps) {
  const roundedRating = Math.round(rating);

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
    >
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              size === "md" ? "size-4.5" : "size-3.5",
              star <= roundedRating
                ? "fill-amber-400 text-amber-400"
                : "fill-slate-100 text-slate-300",
            )}
          />
        ))}
      </span>
      {showValue ? (
        <span className="font-semibold tabular-nums text-foreground">
          {rating.toFixed(1)}
        </span>
      ) : null}
    </div>
  );
}
