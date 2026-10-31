import * as Yup from "yup";

import { DOCTOR_SPECIALTIES } from "@/constants/onboarding";
import { PRACTICE_BIOGRAPHY_MAX_LENGTH } from "@/constants/practice-profile";

const currentYear = new Date().getFullYear();

const profileQualificationSchema = Yup.object({
  degree: Yup.string()
    .trim()
    .min(2, "Degree must be at least 2 characters")
    .max(100, "Degree must not exceed 100 characters")
    .required("Degree is required"),
  institute: Yup.string()
    .trim()
    .min(2, "Institute must be at least 2 characters")
    .max(150, "Institute must not exceed 150 characters")
    .required("Institute is required"),
  year: Yup.number()
    .integer("Year must be a whole number")
    .min(1950, "Year must be 1950 or later")
    .max(currentYear + 1, "Year cannot be in the future")
    .required("Graduation year is required"),
});

export const doctorProfileSchema = Yup.object({
  user: Yup.object({
    name: Yup.string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(80, "Name must not exceed 80 characters")
      .required("Full name is required"),
    email: Yup.string()
      .trim()
      .email("Enter a valid email address")
      .required("Work email is required"),
    phone: Yup.string()
      .nullable()
      .trim()
      .max(20, "Phone number must not exceed 20 characters"),
    gender: Yup.string()
      .nullable()
      .oneOf(["Female", "Male", "Other"]),
  }),
  doctor: Yup.object({
    profilePicture: Yup.string().nullable(),
    specialization: Yup.string()
      .oneOf([...DOCTOR_SPECIALTIES], "Select a valid medical specialty")
      .required("Primary specialty is required"),
    subspecialty: Yup.string()
      .nullable()
      .trim()
      .max(100, "Area of focus must not exceed 100 characters"),
    experience: Yup.number()
      .typeError("Clinical experience must be a number")
      .integer("Clinical experience must be a whole number")
      .min(0, "Clinical experience cannot be negative")
      .max(80, "Clinical experience cannot exceed 80 years")
      .required("Clinical experience is required"),
    bio: Yup.string()
      .nullable()
      .trim()
      .max(
        PRACTICE_BIOGRAPHY_MAX_LENGTH,
        `Biography must not exceed ${PRACTICE_BIOGRAPHY_MAX_LENGTH} characters`,
      ),
    licenseNumber: Yup.string()
      .trim()
      .min(3, "License number must be at least 3 characters")
      .max(80, "License number must not exceed 80 characters")
      .required("Medical license number is required"),
    licensingAuthority: Yup.string().nullable().trim().max(150),
    hospitalName: Yup.string()
      .nullable()
      .trim()
      .max(150, "Hospital or clinic name must not exceed 150 characters"),
    consultationFee: Yup.number()
      .nullable()
      .typeError("Consultation fee must be a number")
      .min(0, "Consultation fee cannot be negative"),
    languages: Yup.array().of(Yup.string().trim().required()).defined(),
    qualification: Yup.array()
      .of(profileQualificationSchema)
      .min(1, "At least one qualification is required")
      .required("At least one qualification is required"),
  }),
});
