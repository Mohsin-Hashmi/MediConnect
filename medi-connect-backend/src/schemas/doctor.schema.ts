import { z } from "zod";

const qualificationSchema = z.object({
  degree: z.string().trim().min(2, "Degree is required").max(100, "Degree must not exceed 100 characters"),
  institute: z
    .string()
    .trim()
    .min(2, "Institute is required")
    .max(150, "Institute must not exceed 150 characters"),
  year: z.coerce
    .number()
    .int("Year must be a valid integer")
    .min(1950, "Year must be 1950 or later")
    .max(new Date().getFullYear() + 1, "Year cannot be in the future"),
});

export const createDoctorSchema = z.object({
  userId: z
    .string()
    .trim()
    .regex(/^[a-fA-F0-9]{24}$/, "User ID must be a valid Mongo ObjectId"),
  specialization: z
    .string()
    .trim()
    .min(2, "Specialization must be at least 2 characters long")
    .max(100, "Specialization must not exceed 100 characters"),
  qualification: z
    .array(qualificationSchema)
    .min(1, "At least one qualification is required"),
  licenseNumber: z
    .string()
    .trim()
    .min(3, "License number must be at least 3 characters long")
    .max(80, "License number must not exceed 80 characters"),
  experience: z.coerce
    .number()
    .min(0, "Experience cannot be negative")
    .max(80, "Experience must not exceed 80 years"),
  hospitalName: z
    .string()
    .trim()
    .max(150, "Hospital name must not exceed 150 characters")
    .optional()
    .nullable(),
  consultationFee: z.coerce
    .number()
    .min(0, "Consultation fee cannot be negative")
    .optional()
    .nullable(),
  bio: z.string().trim().max(1000, "Bio must not exceed 1000 characters").optional().nullable(),
  isVerified: z.boolean().optional().default(false),
});

export const updateDoctorSchema = z.object({
  specialization: z
    .string()
    .trim()
    .min(2, "Specialization must be at least 2 characters long")
    .max(100, "Specialization must not exceed 100 characters")
    .optional(),
  qualification: z
    .array(qualificationSchema)
    .min(1, "At least one qualification is required")
    .optional(),
  licenseNumber: z
    .string()
    .trim()
    .min(3, "License number must be at least 3 characters long")
    .max(80, "License number must not exceed 80 characters")
    .optional(),
  experience: z.coerce
    .number()
    .min(0, "Experience cannot be negative")
    .max(80, "Experience must not exceed 80 years")
    .optional(),
  hospitalName: z
    .string()
    .trim()
    .max(150, "Hospital name must not exceed 150 characters")
    .optional()
    .nullable(),
  consultationFee: z.coerce
    .number()
    .min(0, "Consultation fee cannot be negative")
    .optional()
    .nullable(),
  bio: z.string().trim().max(1000, "Bio must not exceed 1000 characters").optional().nullable(),
  isVerified: z.boolean().optional(),
});

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>;
