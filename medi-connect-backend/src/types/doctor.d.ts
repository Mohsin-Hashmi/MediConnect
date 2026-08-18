export interface IDoctorQualification {
  degree: string;
  institute: string;
  year: number;
}

export interface IDoctor {
  _id: string;
  userId: string;
  specialization: string;
  qualification: IDoctorQualification[];
  licenseNumber: string;
  experience: number;
  hospitalName?: string | null;
  consultationFee?: number | null;
  bio?: string | null;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
