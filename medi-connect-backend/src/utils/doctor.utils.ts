
import {type IDoctorDocument} from '../models/doctor.model.js';
/**
 * - Converts a doctor document into API-safe data.
 */
export const formatDoctor = (doctor: IDoctorDocument) => ({
  id: doctor._id.toString(),
  userId: doctor.userId.toString(),
  specialization: doctor.specialization,
  subspecialty: doctor.subspecialty ?? null,
  qualification: doctor.qualification,
  profilePicture: doctor.profilePicture ?? null,
  licenseNumber: doctor.licenseNumber,
  licensingAuthority: doctor.licensingAuthority ?? null,
  experience: doctor.experience,
  hospitalName: doctor.hospitalName,
  consultationFee: doctor.consultationFee,
  bio: doctor.bio,
  languages: doctor.languages ?? [],
  isVerified: doctor.isVerified,
  createdAt: doctor.createdAt,
  updatedAt: doctor.updatedAt,
});


/**
 * - Converts doctor owner data into a safe response shape.
 */
export const formatDoctorUser = (user: {
  _id: { toString: () => string };
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  profileImage?: string | null;
  gender?: string | null;
}) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  profileImage: user.profileImage,
  gender: user.gender,
});
