import type { DoctorPracticeProfile } from "@/types/practice-profile";

export const PRACTICE_PROFILE_STORAGE_KEY =
  "mediconnect_doctor_practice_profile";

export const PRACTICE_BIOGRAPHY_MAX_LENGTH = 600;
export const PROFILE_IMAGE_MAX_SIZE = 5 * 1024 * 1024;
export const PROFILE_IMAGE_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const INITIAL_PRACTICE_PROFILE: DoctorPracticeProfile = {
  hospitalAffiliation: "",
  consultationFee: "",
  profileImage: null,
  biography: "",
};
