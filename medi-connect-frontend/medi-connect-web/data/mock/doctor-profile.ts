import type { DoctorProfileViewModel } from "@/types/doctor-profile";

export const DOCTOR_PROFILE_FIXTURE: DoctorProfileViewModel = {
  firstName: "Ayesha",
  lastName: "Rahman",
  displayName: "Dr. Ayesha Rahman",
  initials: "AR",
  email: "ayesha.rahman@example.test",
  phone: "+92 300 555 0142",
  gender: "Female",
  specialty: "Cardiologist",
  subspecialty: "Interventional Cardiology",
  experienceYears: 8,
  biography:
    "Cardiologist focused on preventive heart care and evidence-based treatment. I work closely with patients to make diagnosis, treatment options, and long-term care plans clear and practical.",
  licenseNumber: "PMDC-84291-P",
  licensingAuthority: "Pakistan Medical & Dental Council",
  hospitalName: "Central Medical Centre",
  consultationFee: 2500,
  languages: ["English", "Urdu", "Punjabi"],
  qualifications: [
    {
      id: "qualification-mbbs",
      degree: "MBBS",
      institute: "King Edward Medical University",
      year: 2014,
    },
    {
      id: "qualification-fcps",
      degree: "FCPS Cardiology",
      institute: "College of Physicians and Surgeons Pakistan",
      year: 2019,
    },
  ],
  isVerified: true,
  profileCompletion: 92,
};
