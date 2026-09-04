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
import { ServiceError } from "../utils/service-error.util.js";

/**
 * - Creates availability for the authenticated doctor.
 * - Blocks overlapping time ranges on the same day.
 */
export const createAvailability = async (
  authenticatedUserId: string | undefined,
  payload: CreateAvailabilityInput
) => {
  if (!authenticatedUserId) {
    throw new ServiceError("UNAUTHENTICATED", "User is not authenticated");
  }

  const doctor = await DoctorModel.findOne({ userId: authenticatedUserId });

  if (!doctor) {
    throw new ServiceError("NOT_FOUND", "Doctor profile not found");
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
    throw new ServiceError(
      "CONFLICT",
      "Availability overlaps with an existing time range"
    );
  }

  const availability = await AvailabilityModel.create({
    doctorId: doctor._id,
    date: availabilityDate,
    startTime: payload.startTime,
    endTime: payload.endTime,
    slotDuration: payload.slotDuration,
    isAvailable: payload.isAvailable,
  });

  return formatAvailability(availability);
};

/**
 * - Gets all availability records for the authenticated doctor.
 * - Returns them sorted by date and start time.
 */
export const getMyAvailability = async (
  authenticatedUserId: string | undefined
) => {
  if (!authenticatedUserId) {
    throw new ServiceError("UNAUTHENTICATED", "User is not authenticated");
  }

  const doctor = await DoctorModel.findOne({ userId: authenticatedUserId });

  if (!doctor) {
    throw new ServiceError("NOT_FOUND", "Doctor profile not found");
  }

  const availabilities = await AvailabilityModel.find({
    doctorId: doctor._id,
  }).sort({ date: 1, startTime: 1 });

  return availabilities.map(formatAvailability);
};

/**
 * - Updates one availability record owned by the doctor.
 * - Rechecks time validity and overlap rules.
 */
export const updateAvailability = async (
  authenticatedUserId: string | undefined,
  availabilityId: string,
  payload: UpdateAvailabilityInput
) => {
  if (!authenticatedUserId) {
    throw new ServiceError("UNAUTHENTICATED", "User is not authenticated");
  }

  const doctor = await DoctorModel.findOne({ userId: authenticatedUserId });

  if (!doctor) {
    throw new ServiceError("NOT_FOUND", "Doctor profile not found");
  }

  const availability = await AvailabilityModel.findOne({
    _id: availabilityId,
    doctorId: doctor._id,
  });

  if (!availability) {
    throw new ServiceError("NOT_FOUND", "Availability not found");
  }

  const nextAvailabilityDate = payload.date
    ? startOfDay(payload.date)
    : startOfDay(availability.date);
  const nextStartTime = payload.startTime ?? availability.startTime;
  const nextEndTime = payload.endTime ?? availability.endTime;
  const nextSlotDuration = payload.slotDuration ?? availability.slotDuration;
  const startTotalMinutes = timeToMinutes(nextStartTime);
  const endTotalMinutes = timeToMinutes(nextEndTime);

  if (endTotalMinutes <= startTotalMinutes) {
    throw new ServiceError("INVALID_INPUT", "End time must be after start time");
  }

  if (nextSlotDuration > endTotalMinutes - startTotalMinutes) {
    throw new ServiceError(
      "INVALID_INPUT",
      "Slot duration must fit between start time and end time"
    );
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
    throw new ServiceError(
      "CONFLICT",
      "Availability overlaps with an existing time range"
    );
  }

  availability.date = nextAvailabilityDate;
  availability.startTime = nextStartTime;
  availability.endTime = nextEndTime;
  availability.slotDuration = nextSlotDuration;

  if (payload.isAvailable !== undefined) {
    availability.isAvailable = payload.isAvailable;
  }

  await availability.save();

  return formatAvailability(availability);
};

/**
 * - Deletes one availability record owned by the doctor.
 * - Returns the deleted availability data.
 */
export const deleteAvailability = async (
  authenticatedUserId: string | undefined,
  availabilityId: string
) => {
  if (!authenticatedUserId) {
    throw new ServiceError("UNAUTHENTICATED", "User is not authenticated");
  }

  const doctor = await DoctorModel.findOne({ userId: authenticatedUserId });

  if (!doctor) {
    throw new ServiceError("NOT_FOUND", "Doctor profile not found");
  }

  const availability = await AvailabilityModel.findOneAndDelete({
    _id: availabilityId,
    doctorId: doctor._id,
  });

  if (!availability) {
    throw new ServiceError("NOT_FOUND", "Availability not found");
  }

  return formatAvailability(availability);
};

/**
 * - Gets public future availability for one doctor.
 * - Includes generated appointment slots for each record.
 */
export const getDoctorAvailability = async (doctorId: string) => {
  const doctor = await DoctorModel.findById(doctorId);

  if (!doctor) {
    throw new ServiceError("NOT_FOUND", "Doctor profile not found");
  }

  const today = startOfDay(new Date());

  const availabilities = await AvailabilityModel.find({
    doctorId: doctor._id,
    date: { $gte: today },
    isAvailable: true,
  }).sort({ date: 1, startTime: 1 });

  return {
    doctorId: doctor._id.toString(),
    availabilities: availabilities.map(formatAvailabilityWithSlots),
  };
};
