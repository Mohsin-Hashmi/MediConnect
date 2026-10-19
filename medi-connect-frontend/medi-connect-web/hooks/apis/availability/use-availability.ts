"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { AXIOS } from "@/lib/axios";
import type { ApiErrorResponse } from "@/types/auth";
import type { AvailabilityListResponse, AvailabilityMutationResponse, AvailabilityPayload, UpdateAvailabilityVariables } from "@/types/availability";

export function useDoctorAvailability() {
  return useQuery({
    queryKey: ["doctor", "availability"],
    queryFn: async () => {
      const response = await AXIOS.get<AvailabilityListResponse>("/availability/me");
      return response.data.data.availabilities;
    },
  });
}

export function useCreateAvailability() {
  const queryClient = useQueryClient();
  return useMutation<AvailabilityMutationResponse, AxiosError<ApiErrorResponse>, AvailabilityPayload>({
    mutationFn: async (payload) => {
      const response = await AXIOS.post<AvailabilityMutationResponse>(
        "/availability",
        payload,
      );
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["doctor", "availability"],
      });
    },
  });
}

export function useUpdateAvailability() {
  const queryClient = useQueryClient();
  return useMutation<AvailabilityMutationResponse, AxiosError<ApiErrorResponse>, UpdateAvailabilityVariables>({
    mutationFn: async ({ id, payload }) => {
      const response = await AXIOS.patch<AvailabilityMutationResponse>(
        `/availability/${id}`,
        payload,
      );
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["doctor", "availability"],
      });
    },
  });
}

export function useDeleteAvailability() {
  const queryClient = useQueryClient();
  return useMutation<AvailabilityMutationResponse, AxiosError<ApiErrorResponse>, string>({
    mutationFn: async (id) => {
      const response = await AXIOS.delete<AvailabilityMutationResponse>(
        `/availability/${id}`,
      );
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["doctor", "availability"],
      });
    },
  });
}
