import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.mv.js";
import { verifyDoctorRole, verifyPatientRole } from "../middlewares/roles.mv.js";
import { validateSchema } from "../middlewares/validate-schema.mw.js";
import {
  cancelAppointmentSchema,
  createAppointmentSchema,
} from "../schemas/appointment.schema.js";
import {
  cancelAppointment,
  completeAppointment,
  confirmAppointment,
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
appointmentRouter.patch(
  "/:appointmentId/cancel",
  authMiddleware,
  validateSchema(cancelAppointmentSchema),
  cancelAppointment
);
appointmentRouter.patch(
  "/:appointmentId/confirm",
  authMiddleware,
  verifyDoctorRole,
  confirmAppointment
);
appointmentRouter.patch(
  "/:appointmentId/complete",
  authMiddleware,
  verifyDoctorRole,
  completeAppointment
);
appointmentRouter.get("/:appointmentId", authMiddleware, getAppointmentById);
appointmentRouter.post(
  "/",
  authMiddleware,
  verifyPatientRole,
  validateSchema(createAppointmentSchema),
  createAppointment
);
