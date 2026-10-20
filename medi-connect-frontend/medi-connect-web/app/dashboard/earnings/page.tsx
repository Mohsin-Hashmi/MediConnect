import type { Metadata } from "next";

import { EarningsPage } from "@/components/dashboard/earnings/earnings-page";

export const metadata: Metadata = {
  title: "Earnings & Finances",
  description: "Review consultation revenue and settlement activity.",
};

export default function EarningsRoute() {
  return <EarningsPage />;
}
