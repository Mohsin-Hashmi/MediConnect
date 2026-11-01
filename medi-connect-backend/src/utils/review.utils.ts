import type { IReviewDocument } from "../models/review.model.js";

export const formatReview = (review: IReviewDocument) => ({
  id: review._id.toString(),
  appointmentId: review.appointmentId.toString(),
  patientId: review.patientId.toString(),
  doctorId: review.doctorId.toString(),
  rating: review.rating,
  comment: review.comment,
  tags: review.tags,
  doctorReply: review.doctorReply
    ? {
        message: review.doctorReply.message,
        repliedAt: review.doctorReply.repliedAt,
      }
    : null,
  createdAt: review.createdAt,
  updatedAt: review.updatedAt,
});

export const formatReviewAppointment = (appointment: {
  _id: { toString: () => string };
  date: Date;
  startTime: string;
  endTime: string;
  status: string;
  reason?: string | null;
}) => ({
  id: appointment._id.toString(),
  date: appointment.date,
  startTime: appointment.startTime,
  endTime: appointment.endTime,
  status: appointment.status,
  reason: appointment.reason ?? null,
});

export const isDuplicateKeyError = (
  error: unknown,
): error is { code: number } =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  error.code === 11000;

export const getPagination = (page: number, limit: number, total: number) => ({
  page,
  limit,
  total,
  totalPages: Math.max(1, Math.ceil(total / limit)),
});
