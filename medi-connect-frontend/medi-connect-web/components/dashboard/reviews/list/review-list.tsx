import { Error } from "@/components/common/error";
import { Loader } from "@/components/common/loader";
import { NoDataFound } from "@/components/common/no-data-found";
import { ReviewCard } from "@/components/dashboard/reviews/list/review-card";
import type { ReviewListProps } from "@/types/review";

export function ReviewList({
  reviews,
  onReply,
  onResetFilters,
  isLoading = false,
  error = null,
  onRetry,
}: ReviewListProps) {
  if (isLoading) return <Loader label="Loading reviews..." rows={5} />;
  if (error) {
    return (
      <Error title="Could not load reviews" message={error} onRetry={onRetry} />
    );
  }
  if (reviews.length === 0) {
    return (
      <NoDataFound
        title="No reviews found"
        description={
          onResetFilters
            ? "Try different filters or clear the current selection."
            : "Completed appointment reviews will appear here."
        }
        actionLabel={onResetFilters ? "Clear filters" : undefined}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid gap-4 p-5">
      {reviews.map((item) => (
        <ReviewCard key={item.review.id} item={item} onReply={onReply} />
      ))}
    </div>
  );
}
