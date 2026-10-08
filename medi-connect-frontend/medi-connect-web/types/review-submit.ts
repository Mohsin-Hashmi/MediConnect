import type { DoctorProfessionalInfoFormValues } from "@/types/professional-info";
import type { ReactNode } from "react";
import type { Qualification } from "@/types/qualification";
import type { StoredDoctorPracticeProfile } from "@/types/practice-profile";

export interface DoctorReviewData {
  professional: DoctorProfessionalInfoFormValues | null;
  qualifications: Qualification[];
  practiceProfile: StoredDoctorPracticeProfile | null;
}

export interface ReviewSubmitFormValues {
  confirmed: boolean;
}

export interface ReviewCardHeaderProps {
  number: string;
  title: string;
  editHref: string;
}

export interface ReviewDetailItemProps {
  label: string;
  children: ReactNode;
}
