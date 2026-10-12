import type { Metadata } from "next";

import { AvailabilityPage } from "@/components/dashboard/availability/availability-page";

export const metadata: Metadata = { title: "Availability" };

export default function Page() {
  return <AvailabilityPage />;
}
