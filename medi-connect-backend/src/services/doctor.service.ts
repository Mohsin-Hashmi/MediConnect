import { UserModel } from "../models/auth.model.js";
import { DoctorModel } from "../models/doctor.model.js";
import { formatDoctor, formatDoctorUser } from "../utils/doctor.utils.js";
import type {
  CreateDoctorInput,
  UpdateDoctorInput,
} from "../schemas/doctor.schema.js";
import { ServiceError } from "../utils/service-error.util.js";

/**
 * - Escapes user text before building a search regex.
 */
const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");


export type DoctorListOptions = {
  specialization?: string;
  experience?: number;
  search?: string;
  page: number;
  limit: number;
};

/**
 * - Creates a doctor profile for the authenticated user.
 * - Prevents duplicate profiles and license numbers.
 */
export const createDoctorProfile = async (
  authenticatedUserId: string | undefined,
  payload: CreateDoctorInput,
) => {
  if (!authenticatedUserId) {
    throw new ServiceError("UNAUTHENTICATED", "User is not authenticated");
  }

  if (payload.userId && payload.userId !== authenticatedUserId) {
    throw new ServiceError(
      "INVALID_INPUT",
      "Doctor profile must be created for the authenticated user",
    );
  }

  const user = await UserModel.findById(authenticatedUserId);

  if (!user) {
    throw new ServiceError("NOT_FOUND", "User not found");
  }

  const existingDoctor = await DoctorModel.findOne({
    userId: authenticatedUserId,
  });

  if (existingDoctor) {
    throw new ServiceError(
      "CONFLICT",
      "Doctor profile already exists for this user",
    );
  }

  const existingLicense = await DoctorModel.findOne({
    licenseNumber: payload.licenseNumber.trim(),
  });

  if (existingLicense) {
    throw new ServiceError(
      "CONFLICT",
      "This license number is already registered",
    );
  }

  const doctor = await DoctorModel.create({
    userId: authenticatedUserId,
    specialization: payload.specialization,
    qualification: payload.qualification,
    licenseNumber: payload.licenseNumber,
    experience: payload.experience,
    hospitalName: payload.hospitalName ?? null,
    consultationFee: payload.consultationFee ?? null,
    bio: payload.bio ?? null,
    isVerified: payload.isVerified ?? false,
  });

  if (user.role !== "doctor") {
    user.role = "doctor";
    await user.save();
  }

  return formatDoctor(doctor);
};

/**
 * - Finds one doctor profile by ID.
 * - Includes the linked user summary when available.
 */
export const getDoctorById = async (doctorId: string) => {
  const doctor = await DoctorModel.findById(doctorId);

  if (!doctor) {
    throw new ServiceError("NOT_FOUND", "Doctor profile not found");
  }

  const user = await UserModel.findById(doctor.userId).select(
    "_id name email role phone profileImage",
  );

  return {
    doctor: formatDoctor(doctor),
    user: user ? formatDoctorUser(user) : null,
  };
};

/**
 * - Lists doctor profiles with filters and pagination.
 * - Builds database search criteria from validated options.
 */
export const getAllDoctors = async ({
  specialization,
  experience,
  search,
  page,
  limit,
}: DoctorListOptions) => {
  const filter: Record<string, unknown> = {};

  if (specialization) {
    filter.specialization = new RegExp(escapeRegex(specialization), "i");
  }

  if (experience !== undefined) {
    filter.experience = experience;
  }

  if (search) {
    const searchRegex = new RegExp(escapeRegex(search), "i");
    filter.$or = [
      { specialization: searchRegex },
      { hospitalName: searchRegex },
      { bio: searchRegex },
      { "qualification.degree": searchRegex },
      { "qualification.institute": searchRegex },
    ];
  }

  const skip = (page - 1) * limit;
  const [doctors, total] = await Promise.all([
    DoctorModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    DoctorModel.countDocuments(filter),
  ]);

  return {
    doctors: doctors.map(formatDoctor),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * - Deletes the authenticated user's doctor profile.
 * - Resets the user role back to patient when needed.
 */
export const deleteDoctorProfile = async (
  authenticatedUserId: string | undefined,
) => {
  if (!authenticatedUserId) {
    throw new ServiceError("UNAUTHENTICATED", "User is not authenticated");
  }

  const doctor = await DoctorModel.findOneAndDelete({
    userId: authenticatedUserId,
  });

  if (!doctor) {
    throw new ServiceError("NOT_FOUND", "Doctor profile not found");
  }

  const user = await UserModel.findById(authenticatedUserId);

  if (user && user.role === "doctor") {
    user.role = "patient";
    await user.save();
  }

  return formatDoctor(doctor);
};

/**
 * - Updates the authenticated user's doctor profile.
 * - Checks license number conflicts before saving.
 */
export const updateDoctorProfile = async (
  authenticatedUserId: string | undefined,
  payload: UpdateDoctorInput,
) => {
  if (!authenticatedUserId) {
    throw new ServiceError("UNAUTHENTICATED", "User is not authenticated");
  }

  if (!payload || Object.keys(payload).length === 0) {
    throw new ServiceError(
      "INVALID_INPUT",
      "No doctor profile fields provided for update",
    );
  }

  const doctor = await DoctorModel.findOne({ userId: authenticatedUserId });

  if (!doctor) {
    throw new ServiceError("NOT_FOUND", "Doctor profile not found");
  }

  if (payload.licenseNumber) {
    const existingLicense = await DoctorModel.findOne({
      licenseNumber: payload.licenseNumber,
      _id: { $ne: doctor._id },
    });

    if (existingLicense) {
      throw new ServiceError(
        "CONFLICT",
        "This license number is already registered",
      );
    }
  }

  const updatedDoctor = await DoctorModel.findByIdAndUpdate(
    doctor._id,
    { $set: payload },
    { new: true, runValidators: true },
  );

  if (!updatedDoctor) {
    throw new ServiceError("NOT_FOUND", "Doctor profile not found");
  }

  return formatDoctor(updatedDoctor);
};
