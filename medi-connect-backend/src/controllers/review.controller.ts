import type { Request, Response } from "express";
import type { ZodIssue } from "zod";

import {
  doctorReviewsQuerySchema,
  patientReviewsQuerySchema,
  type CreateReviewInput,
  type ReplyToReviewInput,
} from "../schemas/review.schema.js";
import {
  createReview as createReviewService,
  getDoctorReviews as getDoctorReviewsService,
  getPatientReviews as getPatientReviewsService,
  replyToReview as replyToReviewService,
} from "../services/review.service.js";
import { sendControllerError } from "../utils/http-response.util.js";

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

const sendQueryValidationError = (res: Response, issues: ZodIssue[]) => {
  res.status(400).json({
    success: false,
    message: "Validation failed",
    errors: issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    })),
  });
};

export const createReview = async (req: Request, res: Response) => {
  try {
    const review = await createReviewService(
      req.user?.id,
      req.body as CreateReviewInput,
    );

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: { review },
    });
  } catch (error) {
    sendControllerError(res, error, "Create review failed:");
  }
};

export const getDoctorReviews = async (req: Request, res: Response) => {
  const parsedQuery = doctorReviewsQuerySchema.safeParse(req.query);
  if (!parsedQuery.success) {
    sendQueryValidationError(res, parsedQuery.error.issues);
    return;
  }

  try {
    const data = await getDoctorReviewsService(
      req.user?.id,
      parsedQuery.data,
    );

    res.status(200).json({
      success: true,
      message:
        data.reviews.length === 0
          ? "No reviews found"
          : "Reviews retrieved successfully",
      data,
    });
  } catch (error) {
    sendControllerError(res, error, "Get doctor reviews failed:");
  }
};

export const getPatientReviews = async (req: Request, res: Response) => {
  const parsedQuery = patientReviewsQuerySchema.safeParse(req.query);
  if (!parsedQuery.success) {
    sendQueryValidationError(res, parsedQuery.error.issues);
    return;
  }

  try {
    const data = await getPatientReviewsService(
      req.user?.id,
      parsedQuery.data,
    );

    res.status(200).json({
      success: true,
      message:
        data.reviews.length === 0
          ? "No reviews found"
          : "Reviews retrieved successfully",
      data,
    });
  } catch (error) {
    sendControllerError(res, error, "Get patient reviews failed:");
  }
};

export const replyToReview = async (req: Request, res: Response) => {
  const reviewIdParam = req.params.reviewId;
  const reviewId = Array.isArray(reviewIdParam)
    ? reviewIdParam[0]
    : reviewIdParam;

  if (!reviewId || !objectIdRegex.test(reviewId)) {
    res.status(400).json({
      success: false,
      message: "Invalid review ID",
    });
    return;
  }

  try {
    const review = await replyToReviewService(
      req.user?.id,
      reviewId,
      req.body as ReplyToReviewInput,
    );

    res.status(200).json({
      success: true,
      message: "Review reply added successfully",
      data: { review },
    });
  } catch (error) {
    sendControllerError(res, error, "Reply to review failed:");
  }
};
