import * as Yup from "yup";

import { DOCTOR_SPECIALTIES } from "@/constants/onboarding";
import { PRACTICE_BIOGRAPHY_MAX_LENGTH } from "@/constants/practice-profile";

const currentYear = new Date().getFullYear();

const profileQualificationSchema = Yup.object({
  id: Yup.string().required(),
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
  firstName: Yup.string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(40, "First name must not exceed 40 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(40, "Last name must not exceed 40 characters")
    .required("Last name is required"),
  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Work email is required"),
  phone: Yup.string()
    .trim()
    .max(20, "Phone number must not exceed 20 characters"),
  gender: Yup.string().oneOf(["Female", "Male", "Other"]),
  specialty: Yup.string()
    .oneOf([...DOCTOR_SPECIALTIES], "Select a valid medical specialty")
    .required("Primary specialty is required"),
  subspecialty: Yup.string()
    .trim()
    .max(100, "Area of focus must not exceed 100 characters"),
  experienceYears: Yup.number()
    .typeError("Clinical experience must be a number")
    .integer("Clinical experience must be a whole number")
    .min(0, "Clinical experience cannot be negative")
    .max(80, "Clinical experience cannot exceed 80 years")
    .required("Clinical experience is required"),
  biography: Yup.string()
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
  licensingAuthority: Yup.string().trim().max(150).required(),
  hospitalName: Yup.string()
    .trim()
    .min(2, "Enter a valid hospital or clinic name")
    .max(150, "Hospital or clinic name must not exceed 150 characters")
    .required("Hospital or clinic affiliation is required"),
  consultationFee: Yup.number()
    .typeError("Consultation fee must be a number")
    .moreThan(0, "Consultation fee must be greater than zero")
    .required("Consultation fee is required"),
  languages: Yup.array().of(Yup.string().trim().required()).defined(),
  qualifications: Yup.array()
    .of(profileQualificationSchema)
    .min(1, "At least one qualification is required")
    .required("At least one qualification is required"),
});
