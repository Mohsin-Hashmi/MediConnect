import type { Request, Response } from "express";

import { AvailabilityModel } from "../models/availability.model.js";
import { DoctorModel } from "../models/doctor.model.js";
import type {
  CreateAvailabilityInput,
  UpdateAvailabilityInput,
} from "../schemas/availability.schema.js";
import {
  formatAvailability,
  formatAvailabilityWithSlots,
  nextDay,
  startOfDay,
  timeToMinutes,
} from "../utils/availability.util.js";

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

    const availabilityDate = startOfDay(payload.date);
    const availabilityNextDate = nextDay(availabilityDate);

    const overlappingAvailability = await AvailabilityModel.findOne({
      doctorId: doctor._id,
      date: {
        $gte: availabilityDate,
        $lt: availabilityNextDate,
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
        availability: formatAvailability(availability),
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
/**
 * API function to get the authenticated doctor's availability 
 */
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
        availabilities: availabilities.map(formatAvailability),
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
/**
 * API function to update a doctor's availability 
 */
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
      ? startOfDay(payload.date)
      : startOfDay(availability.date);

    const nextStartTime = payload.startTime ?? availability.startTime;
    const nextEndTime = payload.endTime ?? availability.endTime;
    const nextSlotDuration = payload.slotDuration ?? availability.slotDuration;
    const startTotalMinutes = timeToMinutes(nextStartTime);
    const endTotalMinutes = timeToMinutes(nextEndTime);

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

    const availabilityNextDate = nextDay(nextAvailabilityDate);

    const overlappingAvailability = await AvailabilityModel.findOne({
      _id: { $ne: availability._id },
      doctorId: doctor._id,
      date: {
        $gte: nextAvailabilityDate,
        $lt: availabilityNextDate,
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
        availability: formatAvailability(availability),
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

/**
 * API function to delete a doctor's availability
 */
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
        availability: formatAvailability(availability),
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

export const getDoctorAvailability = async (req: Request, res: Response) => {
  try {
    const doctorIdParam = req.params.doctorId;
    const doctorId = Array.isArray(doctorIdParam)
      ? doctorIdParam[0]
      : doctorIdParam;

    if (!doctorId || !/^[a-fA-F0-9]{24}$/.test(doctorId)) {
      res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
      return;
    }

    const doctor = await DoctorModel.findById(doctorId);

    if (!doctor) {
      res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
      return;
    }

    const today = startOfDay(new Date());

    const availabilities = await AvailabilityModel.find({
      doctorId: doctor._id,
      date: { $gte: today },
      isAvailable: true,
    }).sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      message: "Doctor availability retrieved successfully",
      data: {
        doctorId: doctor._id.toString(),
        availabilities: availabilities.map(formatAvailabilityWithSlots),
      },
    });
  } catch (error) {
    console.error("Get doctor availability failed:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
