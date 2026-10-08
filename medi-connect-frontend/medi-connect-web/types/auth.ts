import type { ComponentProps, ReactNode } from "react";

export interface AuthShellProps {
  children: ReactNode;
}

export type PasswordInputProps = Omit<ComponentProps<"input">, "type">;

export type UserRole = "patient" | "doctor" | "admin";
export type OnboardingRole = Exclude<UserRole, "admin">;

export interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  acceptTerms: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
  role: Extract<UserRole, "patient">;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    accessToken: string;
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
