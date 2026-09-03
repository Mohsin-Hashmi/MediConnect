import type { Request, Response } from "express";

import { AppointmentModel, AppointmentStatusEnum } from "../models/appointment.model.js";
import { AvailabilityModel } from "../models/availability.model.js";
import type { CreateAppointmentInput } from "../schemas/appointment.schema.js";
import {
  generateAvailabilitySlots,
  formatAvailability,
  startOfDay,
} from "../utils/availability.util.js";

/**
 * API function to create a new appointment.
 * @param req - Express request object containing the appointment details in the body.
 * @param res - Express response object used to send back the response.
 */

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const authenticatedUserId = req.user?.id;

    if (!authenticatedUserId) {
      res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
      return;
    }

    const payload = req.body as CreateAppointmentInput;
    const availability = await AvailabilityModel.findById(payload.availabilityId);
    const isValidDoctorAvailability = availability?.doctorId.toString() === payload.doctorId;
    if (!availability) {
      res.status(404).json({
        success: false,
        message: "Availability not found",
      });
      return;
    }

    if (!availability.isAvailable) {
      res.status(400).json({
        success: false,
        message: "Availability is not active",
      });
      return;
    }
    if (!isValidDoctorAvailability) {
      res.status(400).json({
        success: false,
        message: "Doctor ID does not match the availability",
      });
      return;
    }

    const appointmentDate = startOfDay(availability.date);

    if (appointmentDate < startOfDay(new Date())) {
      res.status(400).json({
        success: false,
        message: "Cannot book appointment for past availability",
      });
      return;
    }

    const availableSlots = generateAvailabilitySlots({
      startTime: availability.startTime,
      endTime: availability.endTime,
      slotDuration: availability.slotDuration,
    });
    const selectedSlot = availableSlots.find(
      (slot) =>
        slot.startTime === payload.startTime && slot.endTime === payload.endTime
    );

    if (!selectedSlot) {
      res.status(400).json({
        success: false,
        message: "Selected slot is not available",
      });
      return;
    }

    const existingAppointment = await AppointmentModel.findOne({
      availabilityId: availability._id,
      doctorId: payload.doctorId,
      startTime: payload.startTime,
      endTime: payload.endTime,
      status: { $ne: AppointmentStatusEnum.CANCELLED },
    });

    if (existingAppointment) {
      res.status(409).json({
        success: false,
        message: "Selected slot is already booked",
      });
      return;
    }

    const appointment = await AppointmentModel.create({
      patientId: authenticatedUserId,
      doctorId: availability.doctorId,
      availabilityId: availability._id,
      date: appointmentDate,
      startTime: payload.startTime,
      endTime: payload.endTime,
      reason: payload.reason,
      notes: payload.notes,
    });

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: {
        appointment: {
          id: appointment._id.toString(),
          patientId: appointment.patientId.toString(),
          doctorId: appointment.doctorId.toString(),
          availabilityId: appointment.availabilityId.toString(),
          date: appointment.date,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
          status: appointment.status,
          reason: appointment.reason,
          notes: appointment.notes,
          availability: formatAvailability(availability),
          createdAt: appointment.createdAt,
          updatedAt: appointment.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error("Create appointment failed:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


