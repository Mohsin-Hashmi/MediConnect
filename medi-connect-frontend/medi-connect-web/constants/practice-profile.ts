import type { DoctorPracticeProfile } from "@/types/practice-profile";

export const PRACTICE_PROFILE_STORAGE_KEY =
  "mediconnect_doctor_practice_profile";

export const PRACTICE_BIOGRAPHY_MAX_LENGTH = 600;

export const INITIAL_PRACTICE_PROFILE: DoctorPracticeProfile = {
  hospitalAffiliation: "",
  consultationFee: "",
  biography: "",
};
