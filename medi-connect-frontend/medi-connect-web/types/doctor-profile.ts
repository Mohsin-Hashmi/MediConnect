import type { FormikProps } from "formik";
import type { DoctorProfileResponse } from "@/types/doctor";

export type DoctorProfileFormValues = DoctorProfileResponse["data"];

export interface DoctorProfileFormSectionProps {
  formik: FormikProps<DoctorProfileFormValues>;
}

export interface DoctorProfileSummaryProps {
  profile: DoctorProfileFormValues;
}

export interface ProfileFormActionsProps {
  onPreview: () => void;
  isSubmitting: boolean;
}
