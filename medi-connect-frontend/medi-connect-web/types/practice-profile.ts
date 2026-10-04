export interface DoctorPracticeProfile {
  hospitalAffiliation: string;
  consultationFee: string;
  profileImage: File | null;
  biography: string;
}

export interface StoredDoctorPracticeProfile {
  hospitalAffiliation: string;
  consultationFee: string;
  profileImageName: string | null;
  biography: string;
}
