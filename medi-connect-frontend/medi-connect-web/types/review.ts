import type { ApiAppointmentStatus } from "@/types/appointment";

export type ReviewRating = 1 | 2 | 3 | 4 | 5;
export type ReviewReplyStatus = "all" | "replied" | "unanswered";
export type ReviewSortOrder = "newest" | "oldest" | "highest" | "lowest";

export interface Review {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  rating: ReviewRating;
  comment: string;
  tags: string[];
  doctorReply: {
    message: string;
    repliedAt: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorReviewItem {
  review: Review;
  patient: {
    id: string;
    name: string;
    profileImage: string | null;
  } | null;
  appointment: {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    status: ApiAppointmentStatus;
    reason: string | null;
  } | null;
}

export interface ReviewFilters {
  search: string;
  rating: "all" | ReviewRating;
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

export interface DoctorReviewsData {
  reviews: DoctorReviewItem[];
  summary: ReviewMetricsData & {
    ratingDistribution: RatingDistributionItem[];
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DoctorReviewsResponse {
  success: true;
  message: string;
  data: DoctorReviewsData;
}

export interface DoctorReviewsQuery {
  page: number;
  limit: number;
  search?: string;
  rating?: ReviewRating;
  replyStatus?: Exclude<ReviewReplyStatus, "all">;
  sort: ReviewSortOrder;
}

export interface ReplyToReviewPayload {
  reviewId: string;
  message: string;
}

export interface ReviewMutationResponse {
  success: true;
  message: string;
  data: { review: Review };
}

export interface ReviewReplyFormValues {
  message: string;
}

export interface ReviewsPageHeaderProps {
  reviews: readonly DoctorReviewItem[];
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
  reviews: readonly DoctorReviewItem[];
  onReply: (review: DoctorReviewItem) => void;
  onResetFilters?: () => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export interface ReviewCardProps {
  item: DoctorReviewItem;
  onReply: (review: DoctorReviewItem) => void;
}

export interface ReviewReplyDialogProps {
  review: DoctorReviewItem | null;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (values: ReviewReplyFormValues) => void;
}

export interface StarRatingProps {
  rating: number;
  size?: "sm" | "md";
  showValue?: boolean;
  className?: string;
}
