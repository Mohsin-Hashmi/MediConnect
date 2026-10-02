import type { Metadata } from "next";

import { DoctorQualifications } from "@/components/onboarding/doctor/doctor-qualifications";

export const metadata: Metadata = {
  title: "Medical Qualifications",
  description: "Add your medical degrees, fellowships, and certifications.",
};

export default function DoctorQualificationsPage() {
  return <DoctorQualifications />;
}
