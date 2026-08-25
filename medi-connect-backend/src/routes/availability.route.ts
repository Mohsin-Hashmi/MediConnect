import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.mv.js";
import { validateSchema } from "../middlewares/validate-schema.mw.js";
import { createAvailabilitySchema } from "../schemas/availability.schema.js";
import { createAvailability } from "../services/availability.service.js";

export const availabilityRouter = Router();

availabilityRouter.post(
  "/",
  authMiddleware,
  validateSchema(createAvailabilitySchema),
  createAvailability
);
