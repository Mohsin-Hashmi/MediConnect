import {
  AppointmentModel,
  AppointmentStatusEnum,
} from "../models/appointment.model.js";
import { AvailabilityModel } from "../models/availability.model.js";
import { UserModel } from "../models/auth.model.js";
import { DoctorModel } from "../models/doctor.model.js";
import type { CreateAppointmentInput } from "../schemas/appointment.schema.js";
import type { UserRoleName } from "../types/user.js";
import {
  generateAvailabilitySlots,
  startOfDay,
} from "../utils/availability.util.js";
import { formatAppointment, formatPatient, formatDoctor } from "../utils/appointment.utils.js";
import { ServiceError } from "../utils/service-error.util.js";



/**
 * - Finds appointments and attaches matching availability data.
 * - Keeps patient and doctor list responses consistent.
 */
const getAppointmentsWithAvailability = async (
  appointmentFilter: Record<string, unknown>
) => {
  const appointments = await AppointmentModel.find(appointmentFilter).sort({
    date: 1,
    startTime: 1,
    createdAt: -1,
  });

  if (appointments.length === 0) {
    return [];
  }

  const availabilityIds = appointments.map(
    (appointment) => appointment.availabilityId
  );
  const availabilities = await AvailabilityModel.find({
    _id: { $in: availabilityIds },
  });
  const availabilityById = new Map(
    availabilities.map((availability) => [
      availability._id.toString(),
      availability,
    ])
  );

  return appointments.map((appointment) =>
    formatAppointment(
      appointment,
      availabilityById.get(appointment.availabilityId.toString()) ?? null
    )
  );
};

/**
 * - Books an appointment for the authenticated patient.
 * - Validates availability, slot match, and duplicate bookings.
 */
export const createAppointment = async (
  authenticatedUserId: string | undefined,
  payload: CreateAppointmentInput
) => {
  if (!authenticatedUserId) {
    throw new ServiceError("UNAUTHENTICATED", "User is not authenticated");
  }

  const availability = await AvailabilityModel.findById(payload.availabilityId);

  if (!availability) {
    throw new ServiceError("NOT_FOUND", "Availability not found");
  }

  if (!availability.isAvailable) {
    throw new ServiceError("INVALID_INPUT", "Availability is not active");
  }

  if (availability.doctorId.toString() !== payload.doctorId) {
    throw new ServiceError(
      "INVALID_INPUT",
      "Doctor ID does not match the availability"
    );
  }

  const appointmentDate = startOfDay(availability.date);

  if (appointmentDate < startOfDay(new Date())) {
    throw new ServiceError(
      "INVALID_INPUT",
      "Cannot book appointment for past availability"
    );
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
    throw new ServiceError("INVALID_INPUT", "Selected slot is not available");
  }

  const existingAppointment = await AppointmentModel.findOne({
    availabilityId: availability._id,
    doctorId: payload.doctorId,
    startTime: payload.startTime,
    endTime: payload.endTime,
    status: { $ne: AppointmentStatusEnum.CANCELLED },
  });

  if (existingAppointment) {
    throw new ServiceError("CONFLICT", "Selected slot is already booked");
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

  return formatAppointment(appointment, availability);
};

/**
 * - Gets appointments for the authenticated patient.
 * - Includes availability details for each appointment.
 */
export const getMyAppointments = async (
  authenticatedUserId: string | undefined
) => {
  if (!authenticatedUserId) {
    throw new ServiceError("UNAUTHENTICATED", "User is not authenticated");
  }

  return getAppointmentsWithAvailability({
    patientId: authenticatedUserId,
  });
};

/**
 * - Gets appointments for the authenticated doctor.
 * - Includes availability details for each appointment.
 */
export const getDoctorAppointments = async (
  authenticatedUserId: string | undefined
) => {
  if (!authenticatedUserId) {
    throw new ServiceError("UNAUTHENTICATED", "User is not authenticated");
  }

  const doctor = await DoctorModel.findOne({ userId: authenticatedUserId });

  if (!doctor) {
    throw new ServiceError("NOT_FOUND", "Doctor profile not found");
  }

  return getAppointmentsWithAvailability({
    doctorId: doctor._id,
  });
};

/**
 * - Gets one appointment by ID.
 * - Returns role-specific patient or doctor details.
 */
export const getAppointmentById = async (
  authenticatedUserId: string | undefined,
  authenticatedUserRole: UserRoleName | undefined,
  appointmentId: string
) => {
  if (!authenticatedUserId) {
    throw new ServiceError("UNAUTHENTICATED", "User is not authenticated");
  }

  const appointment = await AppointmentModel.findById(appointmentId);

  if (!appointment) {
    throw new ServiceError("NOT_FOUND", "Appointment not found");
  }

  const availability = await AvailabilityModel.findById(
    appointment.availabilityId
  );
  const appointmentResponse = formatAppointment(appointment, availability);

  if (authenticatedUserRole === "patient") {
    if (appointment.patientId.toString() !== authenticatedUserId) {
      throw new ServiceError(
        "UNAUTHORIZED",
        "You are not authorized to view this appointment"
      );
    }

    const doctor = await DoctorModel.findById(appointment.doctorId);

    if (!doctor) {
      throw new ServiceError("NOT_FOUND", "Doctor profile not found");
    }

    const doctorUser = await UserModel.findById(doctor.userId).select(
      "_id name email role phone profileImage"
    );

    return {
      appointment: appointmentResponse,
      doctor: formatDoctor(doctor),
      doctorUser: doctorUser ? formatPatient(doctorUser) : null,
    };
  }

  if (authenticatedUserRole === "doctor") {
    const doctor = await DoctorModel.findOne({ userId: authenticatedUserId });

    if (!doctor) {
      throw new ServiceError("NOT_FOUND", "Doctor profile not found");
    }

    if (appointment.doctorId.toString() !== doctor._id.toString()) {
      throw new ServiceError(
        "UNAUTHORIZED",
        "You are not authorized to view this appointment"
      );
    }

    const patient = await UserModel.findById(appointment.patientId).select(
      "_id name email role phone profileImage"
    );

    if (!patient) {
      throw new ServiceError("NOT_FOUND", "Patient not found");
    }

    return {
      appointment: appointmentResponse,
      patient: formatPatient(patient),
    };
  }

  throw new ServiceError(
    "UNAUTHORIZED",
    "You are not authorized to view this appointment"
  );
};
