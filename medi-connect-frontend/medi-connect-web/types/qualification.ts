export type QualificationStatus = "indexed" | "pending" | "new";

export interface Qualification {
  id: string;
  heading: string;
  tier: string;
  degree: string;
  institution: string;
  graduationYear: string;
  status: QualificationStatus;
}

export interface DoctorQualificationsFormValues {
  qualifications: Qualification[];
}
