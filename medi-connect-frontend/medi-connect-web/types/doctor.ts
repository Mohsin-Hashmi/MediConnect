export interface DoctorQualificationPayload {
  degree: string;
  institute: string;
  year: number;
}

export interface CreateDoctorPayload {
  specialization: string;
  qualification: DoctorQualificationPayload[];
  profilePicture?: string | null;
  licenseNumber: string;
  experience: number;
  hospitalName: string;
  consultationFee: number;
  bio?: string | null;
}

export interface DoctorProfile extends CreateDoctorPayload {
  id: string;
  userId: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDoctorResponse {
  success: boolean;
  message: string;
  data: {
    doctor: DoctorProfile;
  };
}
