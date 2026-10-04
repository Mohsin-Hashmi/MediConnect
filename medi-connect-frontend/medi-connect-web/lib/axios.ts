import axios, { type InternalAxiosRequestConfig } from "axios";

import {
  clearAccessToken,
  getAccessToken,
  replaceAccessToken,
} from "@/lib/auth-storage";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const AXIOS = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

AXIOS.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

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
