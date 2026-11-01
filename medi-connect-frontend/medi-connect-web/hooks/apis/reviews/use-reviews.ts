"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { AXIOS } from "@/lib/axios";
import type { ApiErrorResponse } from "@/types/auth";
import type {
  DoctorReviewsQuery,
  DoctorReviewsResponse,
  ReplyToReviewPayload,
  ReviewMutationResponse,
} from "@/types/review";

export function useDoctorReviews(query: DoctorReviewsQuery) {
  return useQuery({
    queryKey: ["doctor", "reviews", query],
    queryFn: async () => {
      const response = await AXIOS.get<DoctorReviewsResponse>(
        "/reviews/doctor",
        { params: query },
      );
      return response.data.data;
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useReplyToReview() {
  const queryClient = useQueryClient();

  return useMutation<
    ReviewMutationResponse,
    AxiosError<ApiErrorResponse>,
    ReplyToReviewPayload
  >({
    mutationFn: async ({ reviewId, message }) => {
      const response = await AXIOS.patch<ReviewMutationResponse>(
        `/reviews/${reviewId}/reply`,
        { message },
      );
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["doctor", "reviews"] });
    },
  });
}
