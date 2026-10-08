import axios from "axios";

import {
  clearAccessToken,
  getAccessToken,
  replaceAccessToken,
} from "@/lib/auth-storage";
import type { RetryableRequestConfig } from "@/types/axios";
//Axios instance with configuration for base URL, credentials, and headers.
export const AXIOS = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


// Request interceptor to add the access token to the request headers if it exists.
AXIOS.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Response interceptor to handle token refresh logic.
AXIOS.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config as RetryableRequestConfig | undefined;
    const isRefreshRequest = request?.url?.includes("/auth/refresh-token");
    const isCredentialRequest =
      request?.url?.includes("/auth/login") ||
      request?.url?.includes("/auth/register");

    if (
      error.response?.status !== 401 ||
      !request ||
      request._retry ||
      isRefreshRequest ||
      isCredentialRequest
    ) {
      return Promise.reject(error);
    }

    request._retry = true;

    try {
      const response = await AXIOS.post<{
        data: { accessToken: string };
      }>("/auth/refresh-token");
      const accessToken = response.data.data.accessToken;

      replaceAccessToken(accessToken);
      request.headers.Authorization = `Bearer ${accessToken}`;

      return AXIOS(request);
    } catch (refreshError) {
      clearAccessToken();
      return Promise.reject(refreshError);
    }
  },
);
