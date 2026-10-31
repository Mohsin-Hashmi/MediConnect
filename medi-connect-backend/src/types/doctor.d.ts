export interface IDoctorQualification {
  degree: string;
  institute: string;
  year: number;
}

export interface IDoctor {
  _id: string;
  userId: string;
  specialization: string;
  subspecialty?: string | null;
  qualification: IDoctorQualification[];
  profilePicture?: string | null;
  licenseNumber: string;
  licensingAuthority?: string | null;
  experience: number;
  hospitalName?: string | null;
  consultationFee?: number | null;
  bio?: string | null;
  languages: string[];
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
