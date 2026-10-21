import type {
  DoctorReview,
  RatingDistributionItem,
  ReviewFilters,
  ReviewMetricsData,
  ReviewRating,
} from "@/types/review";

export function getReviewMetrics(
  reviews: readonly DoctorReview[],
): ReviewMetricsData {
  const totalReviews = reviews.length;
  const totalRating = reviews.reduce((total, review) => total + review.rating, 0);
  const positiveReviews = reviews.filter((review) => review.rating >= 4).length;

  return {
    averageRating: totalReviews === 0 ? 0 : totalRating / totalReviews,
    totalReviews,
    positivePercentage:
      totalReviews === 0 ? 0 : (positiveReviews / totalReviews) * 100,
    unansweredReviews: reviews.filter((review) => !review.doctorReply).length,
  };
}

export function getRatingDistribution(
  reviews: readonly DoctorReview[],
): RatingDistributionItem[] {
  return ([5, 4, 3, 2, 1] as const).map((rating) => {
    const count = reviews.filter((review) => review.rating === rating).length;
    return {
      rating,
      count,
      percentage: reviews.length === 0 ? 0 : (count / reviews.length) * 100,
    };
  });
}

export function getFilteredReviews(
  reviews: readonly DoctorReview[],
  filters: ReviewFilters,
): DoctorReview[] {
  const search = filters.search.trim().toLowerCase();

  return reviews
    .filter((review) => {
      const matchesSearch =
        search === "" ||
        [review.patientLabel, review.comment, review.service, ...review.tags].some(
          (value) => value.toLowerCase().includes(search),
        );
      const matchesRating =
        filters.rating === "all" || review.rating === filters.rating;
      const matchesConsultation =
        filters.consultationType === "all" ||
        review.consultationType === filters.consultationType;
      const matchesReply =
        filters.replyStatus === "all" ||
        (filters.replyStatus === "replied"
          ? Boolean(review.doctorReply)
          : !review.doctorReply);

      return (
        matchesSearch &&
        matchesRating &&
        matchesConsultation &&
        matchesReply
      );
    })
    .sort((first, second) => {
      if (filters.sort === "highest") return second.rating - first.rating;
      if (filters.sort === "lowest") return first.rating - second.rating;

      const difference =
        new Date(second.submittedAt).getTime() -
        new Date(first.submittedAt).getTime();
      return filters.sort === "oldest" ? -difference : difference;
    });
}

export function isReviewRating(value: number): value is ReviewRating {
  return value >= 1 && value <= 5 && Number.isInteger(value);
}
