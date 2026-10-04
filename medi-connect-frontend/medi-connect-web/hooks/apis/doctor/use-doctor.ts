"use client";

import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { AXIOS } from "@/lib/axios";
import type { ApiErrorResponse } from "@/types/auth";
import type {
  CreateDoctorPayload,
  CreateDoctorResponse,
} from "@/types/doctor";

export function useCreateDoctor() {
  return useMutation<
    CreateDoctorResponse,
    AxiosError<ApiErrorResponse>,
    CreateDoctorPayload
  >({
    mutationKey: ["doctors", "create"],
    mutationFn: async (payload) => {
      const response = await AXIOS.post<CreateDoctorResponse>(
        "/doctors",
        payload,
      );

      return response.data;
    },
  });
}
