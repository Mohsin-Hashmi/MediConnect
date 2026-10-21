"use client";

import { useState } from "react";
import { toast } from "sonner";

import { DataSectionHeader } from "@/components/common/data-section-header";
import { Pagination } from "@/components/common/pagination";
import { ReviewFilterBar } from "@/components/dashboard/reviews/filters/review-filter-bar";
import { ReviewList } from "@/components/dashboard/reviews/list/review-list";
import { RatingBreakdown } from "@/components/dashboard/reviews/sections/rating-breakdown";
import { ReviewMetrics } from "@/components/dashboard/reviews/sections/review-metrics";
import { ReviewsPageHeader } from "@/components/dashboard/reviews/sections/reviews-page-header";
import { Card, CardContent } from "@/components/ui/card";
import { PAGINATION_PAGE_SIZE } from "@/constants/pagination";
import { DOCTOR_REVIEWS_FIXTURE } from "@/data/mock/reviews";
import {
  getFilteredReviews,
  getRatingDistribution,
  getReviewMetrics,
} from "@/lib/reviews";
import type { ReviewFilters } from "@/types/review";

const initialFilters: ReviewFilters = {
  search: "",
  rating: "all",
  consultationType: "all",
  replyStatus: "all",
  sort: "newest",
};

export function ReviewsPage() {
  const [filters, setFilters] = useState<ReviewFilters>(initialFilters);
  const [page, setPage] = useState(1);
  const filtered = getFilteredReviews(DOCTOR_REVIEWS_FIXTURE, filters);
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGINATION_PAGE_SIZE),
  );
  const currentPage = Math.min(page, totalPages);
  const visibleReviews = filtered.slice(
    (currentPage - 1) * PAGINATION_PAGE_SIZE,
    currentPage * PAGINATION_PAGE_SIZE,
  );
  const hasFilters =
    filters.search !== "" ||
    filters.rating !== "all" ||
    filters.consultationType !== "all" ||
    filters.replyStatus !== "all";

  function updateFilters(changes: Partial<ReviewFilters>) {
    setFilters((previous) => ({ ...previous, ...changes }));
    setPage(1);
  }

  function resetFilters() {
    setFilters(initialFilters);
    setPage(1);
  }

  function handleReply() {
    toast.info(
      "Patient review replies will be available after the reviews API is connected.",
    );
  }

  return (
    <section
      aria-label="Patient reviews and ratings"
      className="w-full flex-1 space-y-5 px-4 py-6 sm:px-5 lg:px-6 2xl:px-8"
    >
      <ReviewsPageHeader reviews={filtered} />
      <ReviewMetrics metrics={getReviewMetrics(DOCTOR_REVIEWS_FIXTURE)} />
      <RatingBreakdown
        distribution={getRatingDistribution(DOCTOR_REVIEWS_FIXTURE)}
        totalReviews={DOCTOR_REVIEWS_FIXTURE.length}
      />

      <Card className="min-w-0 gap-0 border-0 py-0 shadow-sm ring-1 ring-slate-200/90">
        <DataSectionHeader
          title="Patient feedback"
          description="Filter and review consultation feedback. Reply controls are currently a UI preview."
          countLabel={`${filtered.length} matching reviews`}
        />
        <CardContent className="px-0">
          <ReviewFilterBar
            filters={filters}
            onChange={updateFilters}
            onReset={resetFilters}
            hasFilters={hasFilters}
          />
          <ReviewList
            reviews={visibleReviews}
            onReply={handleReply}
            onResetFilters={hasFilters ? resetFilters : undefined}
          />
          <Pagination
            currentPage={currentPage}
            totalItems={filtered.length}
            onPageChange={setPage}
            itemLabel="reviews"
          />
        </CardContent>
      </Card>
    </section>
  );
}
