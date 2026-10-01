"use client";

import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { AXIOS } from "@/lib/axios";
import type {
  ApiErrorResponse,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth";


//Login Mutation Function
export function useLogin() {
  return useMutation<AuthResponse, AxiosError<ApiErrorResponse>, LoginPayload>({
    mutationKey: ["auth", "login"],
    mutationFn: async (payload) => {
      const response = await AXIOS.post<AuthResponse>("/auth/login", payload);
      return response.data;
    },
  });
}

//Register Mutation Function
export function useRegister() {
  return useMutation<
    AuthResponse,
    AxiosError<ApiErrorResponse>,
    RegisterPayload
  >({
    mutationKey: ["auth", "register"],
    mutationFn: async (payload) => {
      const response = await AXIOS.post<AuthResponse>(
        "/auth/register",
        payload,
      );
      return response.data;
    },
  });
}
