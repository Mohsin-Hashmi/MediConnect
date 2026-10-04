import * as Yup from "yup";

import { DOCTOR_SPECIALTIES } from "@/constants/onboarding";
import {
  PRACTICE_BIOGRAPHY_MAX_LENGTH,
  PROFILE_IMAGE_ACCEPTED_TYPES,
  PROFILE_IMAGE_MAX_SIZE,
} from "@/constants/practice-profile";
import { GRADUATION_YEARS } from "@/constants/qualification";

export const professionalInfoSchema = Yup.object({
  specialization: Yup.string()
    .oneOf([...DOCTOR_SPECIALTIES], "Select a valid medical specialty")
    .required("Primary specialization is required"),
  licenseNumber: Yup.string()
    .trim()
    .matches(
      /^PMDC-\d{4,6}-[A-Z]$/i,
      "Use a valid PMDC number, for example PMDC-12345-P",
    )
    .required("Medical license number is required"),
  yearsOfExperience: Yup.number()
    .integer("Experience must be a whole number")
    .min(0, "Experience cannot be negative")
    .max(70, "Experience cannot exceed 70 years")
    .required("Years of clinical experience is required"),
});

const qualificationSchema = Yup.object({
  degree: Yup.string()
    .trim()
    .max(100, "Degree title must be 100 characters or fewer")
    .required("Degree or title is required"),
  institution: Yup.string()
    .trim()
    .max(160, "Institution name must be 160 characters or fewer")
    .required("Institution or university is required"),
  graduationYear: Yup.string()
    .oneOf(GRADUATION_YEARS, "Select a valid graduation year")
    .required("Graduation year is required"),
});

export const qualificationsSchema = Yup.object({
  qualifications: Yup.array()
    .of(qualificationSchema)
    .min(1, "Add at least one qualification to continue")
    .required("Add at least one qualification to continue"),
});

export const practiceProfileSchema = Yup.object({
  hospitalAffiliation: Yup.string()
    .trim()
    .min(2, "Enter a valid hospital or clinic name")
    .max(160, "Hospital or clinic name must be 160 characters or fewer")
    .required("Hospital or clinic affiliation is required"),
  consultationFee: Yup.string()
    .trim()
    .required("Consultation fee is required")
    .test(
      "positive-fee",
      "Consultation fee must be greater than zero",
      (value) =>
        value !== undefined &&
        value !== "" &&
        Number.isFinite(Number(value)) &&
        Number(value) > 0,
    ),
  profileImage: Yup.mixed<File>()
    .nullable()
    .test(
      "profile-image-type",
      "Use a JPEG, PNG, or WebP image",
      (file) => !file || PROFILE_IMAGE_ACCEPTED_TYPES.includes(
        file.type as (typeof PROFILE_IMAGE_ACCEPTED_TYPES)[number],
      ),
    )
    .test(
      "profile-image-size",
      "Profile image must be 5 MB or smaller",
      (file) => !file || file.size <= PROFILE_IMAGE_MAX_SIZE,
    ),
  biography: Yup.string()
    .trim()
    .max(
      PRACTICE_BIOGRAPHY_MAX_LENGTH,
      `Biography must be ${PRACTICE_BIOGRAPHY_MAX_LENGTH} characters or fewer`,
    ),
});

export const reviewSubmitSchema = Yup.object({
  confirmed: Yup.boolean()
    .oneOf([true], "Confirm that the reviewed information is accurate")
    .required("Confirm that the reviewed information is accurate"),
});
