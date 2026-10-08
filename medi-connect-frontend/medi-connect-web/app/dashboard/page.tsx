import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Plus } from "lucide-react";

import { DashboardActivityPanels } from "@/components/dashboard/doctor-dashboard/dashboard-activity-panels";
import { DashboardAppointments } from "@/components/dashboard/doctor-dashboard/dashboard-appointments";
import { DashboardMetrics } from "@/components/dashboard/doctor-dashboard/dashboard-metrics";
import { DashboardSidePanels } from "@/components/dashboard/doctor-dashboard/dashboard-side-panels";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { doctorDashboardMock } from "@/data/mock/doctor-dashboard";

export const metadata: Metadata = {
  title: "Doctor Dashboard",
};

export default function DashboardPage() {
  const data = doctorDashboardMock;
  const nextAppointment = data.appointments.find(
    (appointment) => appointment.id === data.nextAppointmentId,
  );

  return (
    <section aria-label="Doctor dashboard overview" className="w-full flex-1 space-y-5 px-4 py-6 sm:px-5 lg:px-6 2xl:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Doctor Portal / <span className="text-foreground">Overview</span>
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Welcome back, Dr. {data.doctor.firstName}
            </h1>
            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
              Demo data
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s an overview of your practice today.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button render={<Link href="/dashboard/calendar" />} variant="outline" className="h-10 gap-2 px-4 text-sm">
            <CalendarDays aria-hidden="true" />
            View calendar
          </Button>
          <Button render={<Link href="/dashboard/availability" />} className="h-10 gap-2 px-4 text-sm">
            <Plus aria-hidden="true" />
            Add availability
          </Button>
        </div>
      </div>

      <DashboardMetrics data={data} />

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.8fr)_minmax(18rem,0.9fr)]">
        <DashboardAppointments appointments={data.appointments} />
        <DashboardSidePanels nextAppointment={nextAppointment} />
      </div>

      <DashboardActivityPanels data={data} />
    </section>
  );
}
