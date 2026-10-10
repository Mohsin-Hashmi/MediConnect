import type { Metadata } from "next";

import { DoctorReviewSubmit } from "@/components/onboarding/doctor/review-submit/doctor-review-submit";

export const metadata: Metadata = {
  title: "Review and Submit",
  description: "Review and submit your doctor profile for verification.",
};

export default function DoctorReviewSubmitPage() {
  return <DoctorReviewSubmit />;
}
