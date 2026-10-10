import type { Metadata } from "next";

import { DoctorPracticeProfile } from "@/components/onboarding/doctor/practice-profile/doctor-practice-profile";

export const metadata: Metadata = {
  title: "Practice and Profile",
  description: "Add your clinical practice details and professional biography.",
};

export default function DoctorPracticeProfilePage() {
  return <DoctorPracticeProfile />;
}
