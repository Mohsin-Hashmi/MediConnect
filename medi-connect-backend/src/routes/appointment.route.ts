import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.mv.js";
import { verifyPatientRole } from "../middlewares/roles.mv.js";
import { validateSchema } from "../middlewares/validate-schema.mw.js";
import { createAppointmentSchema } from "../schemas/appointment.schema.js";
import { createAppointment } from "../services/appointment.service.js";

export const appointmentRouter = Router();

appointmentRouter.post(
  "/",
  authMiddleware,
  verifyPatientRole,
  validateSchema(createAppointmentSchema),
  createAppointment
);
