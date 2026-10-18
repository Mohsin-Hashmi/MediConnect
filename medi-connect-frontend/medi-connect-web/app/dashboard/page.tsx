import type { Metadata } from "next";
import { DashboardOverview } from "@/components/dashboard/doctor-dashboard/dashboard-overview";

export const metadata: Metadata = {
  title: "Doctor Dashboard",
};

export default function DashboardPage() {
  return <DashboardOverview />;
}
