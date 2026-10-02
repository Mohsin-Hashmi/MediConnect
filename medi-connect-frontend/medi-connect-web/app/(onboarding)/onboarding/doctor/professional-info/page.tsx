import type { Metadata } from "next";

import { DoctorProfessionalInfo } from "@/components/onboarding/doctor/doctor-professional-info";

export const metadata: Metadata = {
  title: "Professional Information",
  description: "Add your medical specialty, license, and clinical experience.",
};

export default function DoctorProfessionalInfoPage() {
  return <DoctorProfessionalInfo />;
}
