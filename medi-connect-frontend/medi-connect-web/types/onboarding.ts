import type { DOCTOR_ONBOARDING_STEPS, DOCTOR_SPECIALTIES } from "@/constants/onboarding";

export type DoctorOnboardingStepId = (typeof DOCTOR_ONBOARDING_STEPS)[number]["id"];
export type DoctorSpecialty = (typeof DOCTOR_SPECIALTIES)[number];

export interface DoctorOnboardingStepperProps {
  activeStep: DoctorOnboardingStepId;
}
