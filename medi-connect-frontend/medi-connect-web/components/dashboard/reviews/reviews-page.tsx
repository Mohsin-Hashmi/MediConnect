"use client";

import { useDeferredValue, useState } from "react";
import { toast } from "sonner";

import { DataSectionHeader } from "@/components/common/data-section-header";
import { Pagination } from "@/components/common/pagination";
import { ReviewReplyDialog } from "@/components/dashboard/reviews/dialogs/review-reply-dialog";
import { ReviewFilterBar } from "@/components/dashboard/reviews/filters/review-filter-bar";
import { ReviewList } from "@/components/dashboard/reviews/list/review-list";
import { RatingBreakdown } from "@/components/dashboard/reviews/sections/rating-breakdown";
import { ReviewMetrics } from "@/components/dashboard/reviews/sections/review-metrics";
import { ReviewsPageHeader } from "@/components/dashboard/reviews/sections/reviews-page-header";
import { Card, CardContent } from "@/components/ui/card";
import { PAGINATION_PAGE_SIZE } from "@/constants/pagination";
import {
  useDoctorReviews,
  useReplyToReview,
} from "@/hooks/apis/reviews/use-reviews";
import { getApiErrorMessage } from "@/lib/api-error";
import type {
  DoctorReviewItem,
  ReviewFilters,
  ReviewReplyFormValues,
} from "@/types/review";

const initialFilters: ReviewFilters = {
  search: "",
  rating: "all",
  replyStatus: "all",
  sort: "newest",
};

export function ReviewsPage() {
  const [filters, setFilters] = useState<ReviewFilters>(initialFilters);
  const [page, setPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState<DoctorReviewItem | null>(
    null,
  );
  const deferredSearch = useDeferredValue(filters.search.trim());
  const reviewsQuery = useDoctorReviews({
    page,
    limit: PAGINATION_PAGE_SIZE,
    search: deferredSearch || undefined,
    rating: filters.rating === "all" ? undefined : filters.rating,
    replyStatus:
      filters.replyStatus === "all" ? undefined : filters.replyStatus,
    sort: filters.sort,
  });
  const replyMutation = useReplyToReview();
  const reviews = reviewsQuery.data?.reviews ?? [];
  const hasFilters =
    filters.search !== "" ||
    filters.rating !== "all" ||
    filters.replyStatus !== "all";
  const error =
    reviewsQuery.isError && !reviewsQuery.data
      ? getApiErrorMessage(
        reviewsQuery.error,
        "Patient reviews could not be loaded.",
      )
      : null;

  function updateFilters(changes: Partial<ReviewFilters>) {
    setFilters((previous) => ({ ...previous, ...changes }));
    setPage(1);
  }

  function resetFilters() {
    setFilters(initialFilters);
    setPage(1);
  }

  function handleReply(values: ReviewReplyFormValues) {
    if (!selectedReview) return;

    replyMutation.mutate(
      {
        reviewId: selectedReview.review.id,
        message: values.message.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Review response published successfully.");
          setSelectedReview(null);
        },
        onError: (mutationError) => {
          toast.error(
            getApiErrorMessage(
              mutationError,
              "The review response could not be published.",
            ),
          );
        },
      },
    );
  }

  return (
    <section
      aria-label="Patient reviews and ratings"
      className="w-full flex-1 space-y-5 px-4 py-6 sm:px-5 lg:px-6 2xl:px-8"
    >
      <ReviewsPageHeader reviews={reviews} />

      {reviewsQuery.data ? (
        <>
          <ReviewMetrics metrics={reviewsQuery.data.summary} />
          <RatingBreakdown
            distribution={reviewsQuery.data.summary.ratingDistribution}
            totalReviews={reviewsQuery.data.summary.totalReviews}
          />
        </>
      ) : null}

      <Card className="min-w-0 gap-0 border-0 py-0 shadow-sm ring-1 ring-slate-200/90">
        <DataSectionHeader
          title="Patient feedback"
          description="Filter completed-appointment reviews and respond to patient feedback."
          countLabel={`${reviewsQuery.data?.pagination.total ?? 0} matching reviews`}
        />
        <CardContent className="px-0">
          <ReviewFilterBar
            filters={filters}
            onChange={updateFilters}
            onReset={resetFilters}
            hasFilters={hasFilters}
          />
          <ReviewList
            reviews={reviews}
            onReply={setSelectedReview}
            onResetFilters={hasFilters ? resetFilters : undefined}
            isLoading={reviewsQuery.isPending}
            error={error}
            onRetry={() => void reviewsQuery.refetch()}
          />
          {reviewsQuery.data && !error ? (
            <Pagination
              currentPage={reviewsQuery.data.pagination.page}
              totalItems={reviewsQuery.data.pagination.total}
              onPageChange={setPage}
              itemLabel="reviews"
            />
          ) : null}
        </CardContent>
      </Card>

      <ReviewReplyDialog
        key={selectedReview?.review.id ?? "closed-review-reply"}
        review={selectedReview}
        isPending={replyMutation.isPending}
        onClose={() => setSelectedReview(null)}
        onSubmit={handleReply}
      />
    </section>
  );
}
