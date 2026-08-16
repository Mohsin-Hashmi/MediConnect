import { z } from "zod";

import { UserRole } from "../models/auth.model.js";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(80, "Name must not exceed 80 characters"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(72, "Password must not exceed 72 characters"),
  phone: z.string().trim().max(20, "Phone number must not exceed 20 characters").optional(),
  profileImage: z.string().trim().url("Profile image must be a valid URL").optional().or(z.literal("")),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.string().trim().max(20, "Gender must not exceed 20 characters").optional(),
  address: z.string().trim().max(255, "Address must not exceed 255 characters").optional(),
  role: z.enum(UserRole, "Role must be either patient or doctor"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const profileUpdateSchema = z.object({
  phone: z.string().trim().max(20, "Phone number must not exceed 20 characters").optional().nullable(),
  profileImage: z
    .union([
      z.string().trim().url("Profile image must be a valid URL"),
      z.literal(""),
    ])
    .optional()
    .nullable()
    .transform((value) => (value === "" ? null : value)),
  dateOfBirth: z.coerce.date().optional().nullable(),
  gender: z.string().trim().max(20, "Gender must not exceed 20 characters").optional().nullable(),
  address: z.string().trim().max(255, "Address must not exceed 255 characters").optional().nullable(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
