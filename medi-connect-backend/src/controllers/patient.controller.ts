import type { Request, Response } from "express";

import { getDoctorPatients as getDoctorPatientsService } from "../services/patient.service.js";
import { sendControllerError } from "../utils/http-response.util.js";

export const getDoctorPatients = async (req: Request, res: Response) => {
  try {
    const patients = await getDoctorPatientsService(req.user?.id);
    res.status(200).json({
      success: true,
      message: patients.length === 0 ? "No patients found" : "Patients retrieved successfully",
      data: { patients },
    });
  } catch (error) {
    sendControllerError(res, error, "Get doctor patients failed:");
  }
};
