export type ReviewRating = 1 | 2 | 3 | 4 | 5;
export type ReviewConsultationType = "in-person" | "video";
export type ReviewReplyStatus = "all" | "replied" | "unanswered";
export type ReviewSortOrder = "newest" | "oldest" | "highest" | "lowest";

export interface DoctorReview {
  id: string;
  patientLabel: string;
  rating: ReviewRating;
  comment: string;
  submittedAt: string;
  consultationDate: string;
  consultationType: ReviewConsultationType;
  service: string;
  tags: string[];
  verifiedPatient: boolean;
  doctorReply?: {
    message: string;
    repliedAt: string;
  };
}

export interface ReviewFilters {
  search: string;
  rating: "all" | ReviewRating;
  consultationType: "all" | ReviewConsultationType;
  replyStatus: ReviewReplyStatus;
  sort: ReviewSortOrder;
}

export interface ReviewMetricsData {
  averageRating: number;
  totalReviews: number;
  positivePercentage: number;
  unansweredReviews: number;
}

export interface RatingDistributionItem {
  rating: ReviewRating;
  count: number;
  percentage: number;
}

export interface ReviewsPageHeaderProps {
  reviews: readonly DoctorReview[];
}

export interface ReviewMetricsProps {
  metrics: ReviewMetricsData;
}

export interface RatingBreakdownProps {
  distribution: readonly RatingDistributionItem[];
  totalReviews: number;
}

export interface ReviewFilterBarProps {
  filters: ReviewFilters;
  onChange: (changes: Partial<ReviewFilters>) => void;
  onReset: () => void;
  hasFilters: boolean;
}

export interface ReviewListProps {
  reviews: readonly DoctorReview[];
  onReply: (review: DoctorReview) => void;
  onResetFilters?: () => void;
}

export interface ReviewCardProps {
  review: DoctorReview;
  onReply: (review: DoctorReview) => void;
}

export interface StarRatingProps {
  rating: number;
  size?: "sm" | "md";
  showValue?: boolean;
  className?: string;
}
