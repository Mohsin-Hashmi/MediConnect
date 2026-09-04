import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.mv.js";
import { verifyDoctorRole } from "../middlewares/roles.mv.js";
import { validateSchema } from "../middlewares/validate-schema.mw.js";
import {
  createAvailabilitySchema,
  updateAvailabilitySchema,
} from "../schemas/availability.schema.js";
import {
  createAvailability,
  deleteAvailability,
  getMyAvailability,
  updateAvailability,
} from "../controllers/availability.controller.js";

export const availabilityRouter = Router();

availabilityRouter.get("/me", authMiddleware, verifyDoctorRole, getMyAvailability);
availabilityRouter.patch(
  "/:id",
  authMiddleware,
  verifyDoctorRole,
  validateSchema(updateAvailabilitySchema),
  updateAvailability
);
availabilityRouter.delete(
  "/:id",
  authMiddleware,
  verifyDoctorRole,
  deleteAvailability
);
availabilityRouter.post(
  "/",
  authMiddleware,
  verifyDoctorRole,
  validateSchema(createAvailabilitySchema),
  createAvailability
);
