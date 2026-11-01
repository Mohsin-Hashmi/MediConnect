import { Router } from "express";

import {
  createReview,
  getDoctorReviews,
  getPatientReviews,
  replyToReview,
} from "../controllers/review.controller.js";
import { authMiddleware } from "../middlewares/auth.mv.js";
import { verifyDoctorRole, verifyPatientRole } from "../middlewares/roles.mv.js";
import { validateSchema } from "../middlewares/validate-schema.mw.js";
import {
  createReviewSchema,
  replyToReviewSchema,
} from "../schemas/review.schema.js";

export const reviewRouter = Router();

reviewRouter.get(
  "/doctor",
  authMiddleware,
  verifyDoctorRole,
  getDoctorReviews,
);
reviewRouter.get(
  "/my",
  authMiddleware,
  verifyPatientRole,
  getPatientReviews,
);
reviewRouter.patch(
  "/:reviewId/reply",
  authMiddleware,
  verifyDoctorRole,
  validateSchema(replyToReviewSchema),
  replyToReview,
);
reviewRouter.post(
  "/",
  authMiddleware,
  verifyPatientRole,
  validateSchema(createReviewSchema),
  createReview,
);
