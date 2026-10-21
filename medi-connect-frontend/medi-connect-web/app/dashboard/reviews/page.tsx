import type { Metadata } from "next";

import { ReviewsPage } from "@/components/dashboard/reviews/reviews-page";

export const metadata: Metadata = {
  title: "Patient Reviews & Ratings",
  description: "Review patient feedback and consultation ratings.",
};

export default function ReviewsRoute() {
  return <ReviewsPage />;
}
