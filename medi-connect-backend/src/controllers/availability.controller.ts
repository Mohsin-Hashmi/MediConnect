import type { Request, Response } from "express";

import { AvailabilityModel } from "../models/availability.model.js";
import { DoctorModel } from "../models/doctor.model.js";
import type {
  CreateAvailabilityInput,
  UpdateAvailabilityInput,
} from "../schemas/availability.schema.js";

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

export const getMyAvailability = async (req: Request, res: Response) => {
  try {
    const authenticatedUserId = req.user?.id;

    if (!authenticatedUserId) {
      res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
      return;
    }

    const doctor = await DoctorModel.findOne({ userId: authenticatedUserId });

    if (!doctor) {
      res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
      return;
    }

    const availabilities = await AvailabilityModel.find({
      doctorId: doctor._id,
    }).sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      message: "Availability retrieved successfully",
      data: {
        availabilities: availabilities.map((availability) => ({
          id: availability._id.toString(),
          doctorId: availability.doctorId.toString(),
          date: availability.date,
          startTime: availability.startTime,
          endTime: availability.endTime,
          slotDuration: availability.slotDuration,
          isAvailable: availability.isAvailable,
          createdAt: availability.createdAt,
          updatedAt: availability.updatedAt,
        })),
      },
    });
  } catch (error) {
    console.error("Get my availability failed:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateAvailability = async (req: Request, res: Response) => {
  try {
    const authenticatedUserId = req.user?.id;
    const availabilityIdParam = req.params.id;
    const availabilityId = Array.isArray(availabilityIdParam)
      ? availabilityIdParam[0]
      : availabilityIdParam;

    if (!authenticatedUserId) {
      res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
      return;
    }

    if (!availabilityId || !/^[a-fA-F0-9]{24}$/.test(availabilityId)) {
      res.status(400).json({
        success: false,
        message: "Invalid availability ID",
      });
      return;
    }

    const doctor = await DoctorModel.findOne({ userId: authenticatedUserId });

    if (!doctor) {
      res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
      return;
    }

    const availability = await AvailabilityModel.findOne({
      _id: availabilityId,
      doctorId: doctor._id,
    });

    if (!availability) {
      res.status(404).json({
        success: false,
        message: "Availability not found",
      });
      return;
    }

    const payload = req.body as UpdateAvailabilityInput;
    const nextAvailabilityDate = payload.date
      ? new Date(payload.date)
      : new Date(availability.date);
    nextAvailabilityDate.setHours(0, 0, 0, 0);

    const nextStartTime = payload.startTime ?? availability.startTime;
    const nextEndTime = payload.endTime ?? availability.endTime;
    const nextSlotDuration = payload.slotDuration ?? availability.slotDuration;
    const [startHours = "0", startMinutes = "0"] = nextStartTime.split(":");
    const [endHours = "0", endMinutes = "0"] = nextEndTime.split(":");
    const startTotalMinutes = Number(startHours) * 60 + Number(startMinutes);
    const endTotalMinutes = Number(endHours) * 60 + Number(endMinutes);

    if (endTotalMinutes <= startTotalMinutes) {
      res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
      return;
    }

    if (nextSlotDuration > endTotalMinutes - startTotalMinutes) {
      res.status(400).json({
        success: false,
        message: "Slot duration must fit between start time and end time",
      });
      return;
    }

    const nextDate = new Date(nextAvailabilityDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const overlappingAvailability = await AvailabilityModel.findOne({
      _id: { $ne: availability._id },
      doctorId: doctor._id,
      date: {
        $gte: nextAvailabilityDate,
        $lt: nextDate,
      },
      startTime: { $lt: nextEndTime },
      endTime: { $gt: nextStartTime },
    });

    if (overlappingAvailability) {
      res.status(409).json({
        success: false,
        message: "Availability overlaps with an existing time range",
      });
      return;
    }

    availability.date = nextAvailabilityDate;
    availability.startTime = nextStartTime;
    availability.endTime = nextEndTime;
    availability.slotDuration = nextSlotDuration;

    if (payload.isAvailable !== undefined) {
      availability.isAvailable = payload.isAvailable;
    }

    await availability.save();

    res.status(200).json({
      success: true,
      message: "Availability updated successfully",
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
    console.error("Update availability failed:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteAvailability = async (req: Request, res: Response) => {
  try {
    const authenticatedUserId = req.user?.id;
    const availabilityIdParam = req.params.id;
    const availabilityId = Array.isArray(availabilityIdParam)
      ? availabilityIdParam[0]
      : availabilityIdParam;

    if (!authenticatedUserId) {
      res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
      return;
    }

    if (!availabilityId || !/^[a-fA-F0-9]{24}$/.test(availabilityId)) {
      res.status(400).json({
        success: false,
        message: "Invalid availability ID",
      });
      return;
    }

    const doctor = await DoctorModel.findOne({ userId: authenticatedUserId });

    if (!doctor) {
      res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
      return;
    }

    const availability = await AvailabilityModel.findOneAndDelete({
      _id: availabilityId,
      doctorId: doctor._id,
    });

    if (!availability) {
      res.status(404).json({
        success: false,
        message: "Availability not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Availability deleted successfully",
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
    console.error("Delete availability failed:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
