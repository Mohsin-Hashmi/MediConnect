import type { Request, Response } from "express";

import type { CreateAppointmentInput } from "../schemas/appointment.schema.js";
import {
  createAppointment as createAppointmentService,
  getAppointmentById as getAppointmentByIdService,
  getDoctorAppointments as getDoctorAppointmentsService,
  getMyAppointments as getMyAppointmentsService,
} from "../services/appointment.service.js";
import { sendControllerError } from "../utils/http-response.util.js";

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

/**
 * - Reads appointment body data from the request.
 * - Sends the created appointment response.
 */
export const createAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await createAppointmentService(
      req.user?.id,
      req.body as CreateAppointmentInput
    );

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: {
        appointment,
      },
    });
  } catch (error) {
    sendControllerError(res, error, "Create appointment failed:");
  }
};

/**
 * - Reads the authenticated patient from the request.
 * - Sends that patient's appointments.
 */
export const getMyAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await getMyAppointmentsService(req.user?.id);

    res.status(200).json({
      success: true,
      message:
        appointments.length === 0
          ? "No appointments found"
          : "Appointments retrieved successfully",
      data: {
        appointments,
      },
    });
  } catch (error) {
    sendControllerError(res, error, "Get my appointments failed:");
  }
};

/**
 * - Reads the authenticated doctor from the request.
 * - Sends that doctor's appointments.
 */
export const getDoctorAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await getDoctorAppointmentsService(req.user?.id);

    res.status(200).json({
      success: true,
      message:
        appointments.length === 0
          ? "No appointments found"
          : "Appointments retrieved successfully",
      data: {
        appointments,
      },
    });
  } catch (error) {
    sendControllerError(res, error, "Get doctor appointments failed:");
  }
};

/**
 * - Validates the appointment ID route param.
 * - Sends one appointment with role-specific details.
 */
export const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const appointmentIdParam = req.params.appointmentId;
    const appointmentId = Array.isArray(appointmentIdParam)
      ? appointmentIdParam[0]
      : appointmentIdParam;

    if (!appointmentId || !objectIdRegex.test(appointmentId)) {
      res.status(400).json({
        success: false,
        message: "Invalid appointment ID",
      });
      return;
    }

    const data = await getAppointmentByIdService(
      req.user?.id,
      req.user?.role,
      appointmentId
    );

    res.status(200).json({
      success: true,
      message: "Appointment retrieved successfully",
      data,
    });
  } catch (error) {
    sendControllerError(res, error, "Get appointment failed:");
  }
};
