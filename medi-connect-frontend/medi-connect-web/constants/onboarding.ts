export const DOCTOR_ONBOARDING_STEPS = [
  { id: "professional-info", label: "Professional Info" },
  { id: "qualifications", label: "Qualifications" },
  { id: "practice-profile", label: "Practice & Profile" },
  { id: "review-submit", label: "Review & Submit" },
] as const;

export const DOCTOR_SPECIALTIES = [
  "Cardiologist",
  "Dermatologist",
  "General Physician",
  "Gynecologist",
  "Neurologist",
  "Orthopedic Surgeon",
  "Pediatrician",
  "Psychiatrist",
] as const;

export type DoctorOnboardingStepId =
  (typeof DOCTOR_ONBOARDING_STEPS)[number]["id"];
export type DoctorSpecialty = (typeof DOCTOR_SPECIALTIES)[number];
