export interface DoctorQualificationPayload {
  degree: string;
  institute: string;
  year: number;
}

export interface CreateDoctorPayload {
  specialization: string;
  subspecialty?: string | null;
  qualification: DoctorQualificationPayload[];
  profilePicture?: string | null;
  licenseNumber: string;
  licensingAuthority?: string | null;
  experience: number;
  hospitalName: string;
  consultationFee: number;
  bio?: string | null;
  languages?: string[];
}

export interface DoctorProfile {
  id: string;
  userId: string;
  specialization: string;
  subspecialty: string | null;
  qualification: DoctorQualificationPayload[];
  profilePicture: string | null;
  licenseNumber: string;
  licensingAuthority: string | null;
  experience: number;
  hospitalName: string | null;
  consultationFee: number | null;
  bio: string | null;
  languages: string[];
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export type DoctorProfileGender = "Female" | "Male" | "Other";

export interface DoctorProfileAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  profileImage: string | null;
  gender: DoctorProfileGender | null;
}

export interface DoctorProfileResponse {
  success: boolean;
  message: string;
  data: {
    doctor: DoctorProfile;
    user: DoctorProfileAccount;
  };
}

export interface UpdateDoctorProfilePayload {
  specialization: string;
  subspecialty: string | null;
  profilePicture: string | null;
  experience: number;
  hospitalName: string | null;
  consultationFee: number | null;
  bio: string | null;
  languages: string[];
}

export interface UpdateDoctorAccountPayload {
  name: string;
  phone: string | null;
  gender: DoctorProfileGender | null;
}

export interface UpdateDoctorProfileVariables {
  account: UpdateDoctorAccountPayload;
  doctor: UpdateDoctorProfilePayload;
}

export interface DoctorMutationResponse {
  success: boolean;
  message: string;
  data: {
    doctor: DoctorProfile;
  };
}

export interface UserProfileMutationResponse {
  success: boolean;
  message: string;
  data: {
    user: DoctorProfileAccount;
  };
}

export interface CreateDoctorResponse {
  success: boolean;
  message: string;
  data: {
    doctor: DoctorProfile;
  };
}

export interface DoctorSubmissionSuccessDialogProps {
  doctor: DoctorProfile | null;
  open: boolean;
  onContinue: () => void;
}
