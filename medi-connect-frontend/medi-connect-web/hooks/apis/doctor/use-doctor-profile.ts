"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { AXIOS } from "@/lib/axios";
import type { ApiErrorResponse } from "@/types/auth";
import type {
  DoctorMutationResponse,
  DoctorProfileResponse,
  UpdateDoctorProfileVariables,
  UserProfileMutationResponse,
} from "@/types/doctor";

export function useDoctorProfile() {
  return useQuery({
    queryKey: ["doctor", "profile"],
    queryFn: async () => {
      const response = await AXIOS.get<DoctorProfileResponse>("/doctors/me");

      return response.data.data;
    },
  });
}

export function useUpdateDoctorProfile() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<ApiErrorResponse>,
    UpdateDoctorProfileVariables
  >({
    mutationFn: async ({ account, doctor }) => {
      await Promise.all([
        AXIOS.patch<UserProfileMutationResponse>("/users/profile", account),
        AXIOS.patch<DoctorMutationResponse>("/doctors/me", doctor),
      ]);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["doctor", "profile"] });
    },
  });
}
