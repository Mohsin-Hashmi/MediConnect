import type { IAppointmentDocument } from "../models/appointment.model.js";
import type { IAvailabilityDocument } from "../models/availability.model.js";
import { IDoctorDocument } from "../models/doctor.model.js";
import { formatAvailability } from "./availability.util.js";

export const formatAppointment = (
  appointment: IAppointmentDocument,
  availability?: IAvailabilityDocument | null
) => ({
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
  availability: availability ? formatAvailability(availability) : null,
  createdAt: appointment.createdAt,
  updatedAt: appointment.updatedAt,
});

/**
 * - Converts patient user data into a safe response shape.
 */
export const formatPatient = (patient: {
  _id: { toString: () => string };
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  profileImage?: string | null;
}) => ({
  id: patient._id.toString(),
  name: patient.name,
  email: patient.email,
  role: patient.role,
  phone: patient.phone,
  profileImage: patient.profileImage,
});

/**
 * - Converts a doctor document into API-safe data.
 */
export const formatDoctor = (doctor: IDoctorDocument) => ({
  id: doctor._id.toString(),
  userId: doctor.userId.toString(),
  specialization: doctor.specialization,
  qualification: doctor.qualification,
  licenseNumber: doctor.licenseNumber,
  experience: doctor.experience,
  hospitalName: doctor.hospitalName,
  consultationFee: doctor.consultationFee,
  bio: doctor.bio,
  isVerified: doctor.isVerified,
  createdAt: doctor.createdAt,
  updatedAt: doctor.updatedAt,
});