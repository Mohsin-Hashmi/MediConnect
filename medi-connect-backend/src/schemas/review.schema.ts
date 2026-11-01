import { z } from "zod";

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-fA-F0-9]{24}$/, "ID must be a valid Mongo ObjectId");

const reviewRatingSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

export const createReviewSchema = z.object({
  appointmentId: objectIdSchema,
  rating: reviewRatingSchema,
  comment: z
    .string()
    .trim()
    .min(10, "Review comment must be at least 10 characters long")
    .max(1000, "Review comment must not exceed 1000 characters"),
  tags: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Review tags must not be empty")
        .max(40, "Review tags must not exceed 40 characters"),
    )
    .max(5, "A review can contain at most 5 tags")
    .default([]),
});

export const replyToReviewSchema = z.object({
  message: z
    .string()
    .trim()
    .min(2, "Reply must be at least 2 characters long")
    .max(1000, "Reply must not exceed 1000 characters"),
});

export const doctorReviewsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  rating: z.preprocess(
    (value) => (value === undefined ? undefined : Number(value)),
    reviewRatingSchema.optional(),
  ),
  replyStatus: z.enum(["replied", "unanswered"]).optional(),
  sort: z.enum(["newest", "oldest", "highest", "lowest"]).default("newest"),
  search: z.string().trim().max(100).optional(),
});

export const patientReviewsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type ReplyToReviewInput = z.infer<typeof replyToReviewSchema>;
export type DoctorReviewsQuery = z.infer<typeof doctorReviewsQuerySchema>;
export type PatientReviewsQuery = z.infer<typeof patientReviewsQuerySchema>;
