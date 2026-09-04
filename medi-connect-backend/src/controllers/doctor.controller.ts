import type { Request, Response } from "express";

import type {
  CreateDoctorInput,
  UpdateDoctorInput,
} from "../schemas/doctor.schema.js";
import {
  createDoctorProfile as createDoctorProfileService,
  deleteDoctorProfile as deleteDoctorProfileService,
  getAllDoctors as getAllDoctorsService,
  getDoctorById as getDoctorByIdService,
  updateDoctorProfile as updateDoctorProfileService,
  type DoctorListOptions,
} from "../services/doctor.service.js";
import { sendControllerError } from "../utils/http-response.util.js";

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

/**
 * - Reads a single string value from query params.
 */
const queryValue = (value: unknown): string | undefined =>
  typeof value === "string" ? value : undefined;

/**
 * - Validates doctor list filters and pagination.
 * - Returns typed options for the service layer.
 */
const parseDoctorListOptions = (query: Request["query"]) => {
  const specialization = queryValue(query.specialization)?.trim();
  const experienceValue = queryValue(query.experience);
  const search = queryValue(query.search)?.trim();
  const pageValue = queryValue(query.page) ?? "1";
  const limitValue = queryValue(query.limit) ?? "10";
  const page = Number(pageValue);
  const limit = Number(limitValue);

  if (
    (experienceValue !== undefined &&
      (!/^\d+(\.\d+)?$/.test(experienceValue) ||
        Number(experienceValue) < 0)) ||
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 10
  ) {
    return null;
  }

  const options: DoctorListOptions = {
    page,
    limit,
  };

  if (specialization) {
    options.specialization = specialization;
  }

  if (experienceValue !== undefined) {
    options.experience = Number(experienceValue);
  }

  if (search) {
    options.search = search;
  }

  return options;
};

/**
 * - Reads authenticated user and doctor body data.
 * - Sends the created doctor profile response.
 */
export const createDoctorProfile = async (req: Request, res: Response) => {
  try {
    const doctor = await createDoctorProfileService(
      req.user?.id,
      req.body as CreateDoctorInput
    );

    res.status(201).json({
      success: true,
      message: "Doctor profile created successfully",
      data: {
        doctor,
      },
    });
  } catch (error) {
    sendControllerError(res, error, "Create doctor profile failed:");
  }
};

/**
 * - Validates the doctor ID route param.
 * - Sends one doctor profile with user details.
 */
export const getDoctorById = async (req: Request, res: Response) => {
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

    const data = await getDoctorByIdService(doctorId);

    res.status(200).json({
      success: true,
      message: "Doctor profile retrieved successfully",
      data,
    });
  } catch (error) {
    sendControllerError(res, error, "Get doctor profile failed:");
  }
};

/**
 * - Validates list query params.
 * - Sends filtered doctor profiles with pagination.
 */
export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const options = parseDoctorListOptions(req.query);

    if (!options) {
      res.status(400).json({
        success: false,
        message: "Invalid filter or pagination parameters",
      });
      return;
    }

    const data = await getAllDoctorsService(options);

    res.status(200).json({
      success: true,
      message: "Doctor profiles retrieved successfully",
      data,
    });
  } catch (error) {
    sendControllerError(res, error, "Get all doctors failed:");
  }
};

/**
 * - Reads the authenticated user.
 * - Sends the deleted doctor profile response.
 */
export const deleteDoctorProfile = async (req: Request, res: Response) => {
  try {
    const doctor = await deleteDoctorProfileService(req.user?.id);

    res.status(200).json({
      success: true,
      message: "Doctor profile deleted successfully",
      data: {
        doctor,
      },
    });
  } catch (error) {
    sendControllerError(res, error, "Delete doctor profile failed:");
  }
};

/**
 * - Reads update data from the request body.
 * - Sends the updated doctor profile response.
 */
export const updateDoctorProfile = async (req: Request, res: Response) => {
  try {
    const payload = req.body as UpdateDoctorInput;
    const doctor = await updateDoctorProfileService(
      req.user?.id,
      payload
    );

    res.status(200).json({
      success: true,
      message: "Doctor profile updated successfully",
      data: {
        doctor,
      },
    });
  } catch (error) {
    sendControllerError(res, error, "Update doctor profile failed:");
  }
};


