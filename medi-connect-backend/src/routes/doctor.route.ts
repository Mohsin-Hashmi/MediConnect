import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.mv.js";
import { validateSchema } from "../middlewares/validate-schema.mw.js";
import { createDoctorSchema } from "../schemas/doctor.schema.js";
import {
  createDoctorProfile,
  getDoctorById,
} from "../services/doctor.service.js";

export const doctorRouter = Router();


doctorRouter.post(
  "/",
  authMiddleware,
  validateSchema(createDoctorSchema),
  createDoctorProfile
);
doctorRouter.get("/:doctorId", getDoctorById);