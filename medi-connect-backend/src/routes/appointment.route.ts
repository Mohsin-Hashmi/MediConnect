import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.mv.js";
import { verifyDoctorRole, verifyPatientRole } from "../middlewares/roles.mv.js";
import { validateSchema } from "../middlewares/validate-schema.mw.js";
import { createAppointmentSchema } from "../schemas/appointment.schema.js";
import {
  createAppointment,
  getAppointmentById,
  getDoctorAppointments,
  getMyAppointments,
} from "../controllers/appointment.controller.js";

export const appointmentRouter = Router();

appointmentRouter.get("/my", authMiddleware, verifyPatientRole, getMyAppointments);
appointmentRouter.get(
  "/doctor",
  authMiddleware,
  verifyDoctorRole,
  getDoctorAppointments
);
appointmentRouter.get("/:appointmentId", authMiddleware, getAppointmentById);
appointmentRouter.post(
  "/",
  authMiddleware,
  verifyPatientRole,
  validateSchema(createAppointmentSchema),
  createAppointment
);
