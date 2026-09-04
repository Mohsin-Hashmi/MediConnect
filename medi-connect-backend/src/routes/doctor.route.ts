import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.mv.js";
import { getDoctorAvailability } from "../controllers/availability.controller.js";
import { validateSchema } from "../middlewares/validate-schema.mw.js";
import { createDoctorSchema } from "../schemas/doctor.schema.js";
import {
  createDoctorProfile,
  deleteDoctorProfile,
  getAllDoctors,
  getDoctorById,
  updateDoctorProfile,
} from "../controllers/doctor.controller.js";
import { updateDoctorSchema } from "../schemas/doctor.schema.js";
import { verifyPatientRole } from "../middlewares/roles.mv.js";

export const doctorRouter = Router();

doctorRouter.get("/", getAllDoctors);
doctorRouter.post(
  "/",
  authMiddleware,
  validateSchema(createDoctorSchema),
  createDoctorProfile
);
doctorRouter.get("/:doctorId/availability",authMiddleware, verifyPatientRole, getDoctorAvailability);
doctorRouter.get("/:doctorId", getDoctorById);
doctorRouter.delete("/me", authMiddleware, deleteDoctorProfile);
doctorRouter.patch(
  "/me",
  authMiddleware,
  validateSchema(updateDoctorSchema),
  updateDoctorProfile
);
