import type { Request, Response } from "express";

import type {
  CancelAppointmentInput,
  CreateAppointmentInput,
} from "../schemas/appointment.schema.js";
import {
  cancelAppointment as cancelAppointmentService,
  completeAppointment as completeAppointmentService,
  confirmAppointment as confirmAppointmentService,
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
 * - Validates the appointment ID route param.
 * - Sends the confirmed appointment response.
 */
export const confirmAppointment = async (req: Request, res: Response) => {
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

    const appointment = await confirmAppointmentService(
      req.user?.id,
      appointmentId
    );

    res.status(200).json({
      success: true,
      message: "Appointment confirmed successfully",
      data: {
        appointment,
      },
    });
  } catch (error) {
    sendControllerError(res, error, "Confirm appointment failed:");
  }
};

/**
 * - Validates the appointment ID route param.
 * - Sends the completed appointment response.
 */
export const completeAppointment = async (req: Request, res: Response) => {
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

    const appointment = await completeAppointmentService(
      req.user?.id,
      appointmentId
    );

    res.status(200).json({
      success: true,
      message: "Appointment completed successfully",
      data: {
        appointment,
      },
    });
  } catch (error) {
    sendControllerError(res, error, "Complete appointment failed:");
  }
};

/**
 * - Validates the appointment ID route param.
 * - Sends the cancelled appointment response.
 */
export const cancelAppointment = async (req: Request, res: Response) => {
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

    const appointment = await cancelAppointmentService(
      req.user?.id,
      req.user?.role,
      appointmentId,
      req.body as CancelAppointmentInput
    );

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      data: {
        appointment,
      },
    });
  } catch (error) {
    sendControllerError(res, error, "Cancel appointment failed:");
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
