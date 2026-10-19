import type { FormikProps } from "formik";

export interface DoctorProfileQualification {
  id: string;
  degree: string;
  institute: string;
  year: number;
}

export interface DoctorProfileViewModel {
  firstName: string;
  lastName: string;
  displayName: string;
  initials: string;
  email: string;
  phone: string;
  gender: "Female" | "Male" | "Other";
  specialty: string;
  subspecialty: string;
  experienceYears: number;
  biography: string;
  licenseNumber: string;
  licensingAuthority: string;
  hospitalName: string;
  consultationFee: number;
  languages: string[];
  qualifications: DoctorProfileQualification[];
  isVerified: boolean;
  profileCompletion: number;
}

export interface DoctorProfileSectionProps {
  profile: DoctorProfileViewModel;
}

export type DoctorProfileFormValues = Omit<
  DoctorProfileViewModel,
  "displayName" | "initials" | "isVerified" | "profileCompletion"
>;

export interface DoctorProfileFormSectionProps
  extends DoctorProfileSectionProps {
  formik: FormikProps<DoctorProfileFormValues>;
}

export interface ProfileFormActionsProps {
  onPreview: () => void;
  isSubmitting: boolean;
}
