import type { Metadata } from "next";

import { DoctorProfilePage } from "@/components/dashboard/doctor-profile/doctor-profile-page";

export const metadata: Metadata = {
  title: "Doctor Profile",
  description: "Manage your doctor profile and professional information.",
};

export default function ProfilePage() {
  return <DoctorProfilePage />;
}
