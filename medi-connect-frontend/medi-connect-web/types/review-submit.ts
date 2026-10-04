import type { DoctorProfessionalInfoFormValues } from "@/types/professional-info";
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
