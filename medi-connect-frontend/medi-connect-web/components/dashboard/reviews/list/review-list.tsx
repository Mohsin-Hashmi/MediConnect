import { NoDataFound } from "@/components/common/no-data-found";
import { ReviewCard } from "@/components/dashboard/reviews/list/review-card";
import type { ReviewListProps } from "@/types/review";

export function ReviewList({
  reviews,
  onReply,
  onResetFilters,
}: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <NoDataFound
        title="No reviews found"
        description={
          onResetFilters
            ? "Try different filters or clear the current selection."
            : "Patient feedback will appear here when the reviews API is connected."
        }
        actionLabel={onResetFilters ? "Clear filters" : undefined}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid gap-4 p-5">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} onReply={onReply} />
      ))}
    </div>
  );
}
