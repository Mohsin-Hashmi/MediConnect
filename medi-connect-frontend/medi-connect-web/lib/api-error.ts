import { isAxiosError } from "axios";

import type { ApiErrorResponse } from "@/types/auth";

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
) {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data.message ?? fallback;
  }

  return error instanceof Error ? error.message : fallback;
}
