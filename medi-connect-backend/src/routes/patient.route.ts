import { Router } from "express";

import { getDoctorPatients } from "../controllers/patient.controller.js";
import { authMiddleware } from "../middlewares/auth.mv.js";
import { verifyDoctorRole } from "../middlewares/roles.mv.js";

export const patientRouter = Router();

patientRouter.get("/doctor", authMiddleware, verifyDoctorRole, getDoctorPatients);
