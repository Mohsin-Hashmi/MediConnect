import type { Request, Response } from "express";

import type {
  CreateAvailabilityInput,
  UpdateAvailabilityInput,
} from "../schemas/availability.schema.js";
import {
  createAvailability as createAvailabilityService,
  deleteAvailability as deleteAvailabilityService,
  getDoctorAvailability as getDoctorAvailabilityService,
  getMyAvailability as getMyAvailabilityService,
  updateAvailability as updateAvailabilityService,
} from "../services/availability.service.js";
import { sendControllerError } from "../utils/http-response.util.js";

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

/**
 * - Reads availability body data from the request.
 * - Sends the created availability response.
 */
export const createAvailability = async (req: Request, res: Response) => {
  try {
    const availability = await createAvailabilityService(
      req.user?.id,
      req.body as CreateAvailabilityInput
    );

    res.status(201).json({
      success: true,
      message: "Availability created successfully",
      data: {
        availability,
      },
    });
  } catch (error) {
    sendControllerError(res, error, "Create availability failed:");
  }
};

/**
 * - Reads the authenticated doctor from the request.
 * - Sends that doctor's availability list.
 */
export const getMyAvailability = async (req: Request, res: Response) => {
  try {
    const availabilities = await getMyAvailabilityService(req.user?.id);

    res.status(200).json({
      success: true,
      message: "Availability retrieved successfully",
      data: {
        availabilities,
      },
    });
  } catch (error) {
    sendControllerError(res, error, "Get my availability failed:");
  }
};

/**
 * - Validates the availability ID route param.
 * - Sends the updated availability response.
 */
export const updateAvailability = async (req: Request, res: Response) => {
  try {
    const availabilityIdParam = req.params.id;
    const availabilityId = Array.isArray(availabilityIdParam)
      ? availabilityIdParam[0]
      : availabilityIdParam;

    if (!availabilityId || !objectIdRegex.test(availabilityId)) {
      res.status(400).json({
        success: false,
        message: "Invalid availability ID",
      });
      return;
    }

    const availability = await updateAvailabilityService(
      req.user?.id,
      availabilityId,
      req.body as UpdateAvailabilityInput
    );

    res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      data: {
        availability,
      },
    });
  } catch (error) {
    sendControllerError(res, error, "Update availability failed:");
  }
};

/**
 * - Validates the availability ID route param.
 * - Sends the deleted availability response.
 */
export const deleteAvailability = async (req: Request, res: Response) => {
  try {
    const availabilityIdParam = req.params.id;
    const availabilityId = Array.isArray(availabilityIdParam)
      ? availabilityIdParam[0]
      : availabilityIdParam;

    if (!availabilityId || !objectIdRegex.test(availabilityId)) {
      res.status(400).json({
        success: false,
        message: "Invalid availability ID",
      });
      return;
    }

    const availability = await deleteAvailabilityService(
      req.user?.id,
      availabilityId
    );

    res.status(200).json({
      success: true,
      message: "Availability deleted successfully",
      data: {
        availability,
      },
    });
  } catch (error) {
    sendControllerError(res, error, "Delete availability failed:");
  }
};

/**
 * - Validates the doctor ID route param.
 * - Sends future availability with generated slots.
 */
export const getDoctorAvailability = async (req: Request, res: Response) => {
  try {
    const doctorIdParam = req.params.doctorId;
    const doctorId = Array.isArray(doctorIdParam)
      ? doctorIdParam[0]
      : doctorIdParam;

    if (!doctorId || !objectIdRegex.test(doctorId)) {
      res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
      return;
    }

    const data = await getDoctorAvailabilityService(doctorId);

    res.status(200).json({
      success: true,
      message: "Doctor availability retrieved successfully",
      data,
    });
  } catch (error) {
    sendControllerError(res, error, "Get doctor availability failed:");
  }
};
