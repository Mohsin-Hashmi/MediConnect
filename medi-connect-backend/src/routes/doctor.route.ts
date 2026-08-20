import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.mv.js";
import { validateSchema } from "../middlewares/validate-schema.mw.js";
import { createDoctorSchema } from "../schemas/doctor.schema.js";
import {
  createDoctorProfile,
  deleteDoctorProfile,
  getAllDoctors,
  getDoctorById,
  updateDoctorProfile,
} from "../services/doctor.service.js";
import { updateDoctorSchema } from "../schemas/doctor.schema.js";

export const doctorRouter = Router();

doctorRouter.get("/", getAllDoctors);
doctorRouter.post(
  "/",
  authMiddleware,
  validateSchema(createDoctorSchema),
  createDoctorProfile
);
doctorRouter.get("/:doctorId", getDoctorById);
doctorRouter.delete("/me", authMiddleware, deleteDoctorProfile);
doctorRouter.patch(
  "/me",
  authMiddleware,
  validateSchema(updateDoctorSchema),
  updateDoctorProfile
);
