import type { Request, Response } from "express";

import { AvailabilityModel } from "../models/availability.model.js";
import { DoctorModel } from "../models/doctor.model.js";
import type { CreateAvailabilityInput } from "../schemas/availability.schema.js";

export const createAvailability = async (req: Request, res: Response) => {
  try {
    const authenticatedUserId = req.user?.id;

    if (!authenticatedUserId) {
      res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
      return;
    }

    if (req.user?.role !== "doctor") {
      res.status(403).json({
        success: false,
        message: "Only doctors can create availability",
      });
      return;
    }

    const payload = req.body as CreateAvailabilityInput;
    const doctor = await DoctorModel.findOne({ userId: authenticatedUserId });

    if (!doctor) {
      res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
      return;
    }

    const availabilityDate = new Date(payload.date);
    availabilityDate.setHours(0, 0, 0, 0);

    const nextDate = new Date(availabilityDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const overlappingAvailability = await AvailabilityModel.findOne({
      doctorId: doctor._id,
      date: {
        $gte: availabilityDate,
        $lt: nextDate,
      },
      startTime: { $lt: payload.endTime },
      endTime: { $gt: payload.startTime },
    });

    if (overlappingAvailability) {
      res.status(409).json({
        success: false,
        message: "Availability overlaps with an existing time range",
      });
      return;
    }

    const availability = await AvailabilityModel.create({
      doctorId: doctor._id,
      date: availabilityDate,
      startTime: payload.startTime,
      endTime: payload.endTime,
      slotDuration: payload.slotDuration,
      isAvailable: payload.isAvailable,
    });

    res.status(201).json({
      success: true,
      message: "Availability created successfully",
      data: {
        availability: {
          id: availability._id.toString(),
          doctorId: availability.doctorId.toString(),
          date: availability.date,
          startTime: availability.startTime,
          endTime: availability.endTime,
          slotDuration: availability.slotDuration,
          isAvailable: availability.isAvailable,
          createdAt: availability.createdAt,
          updatedAt: availability.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error("Create availability failed:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
