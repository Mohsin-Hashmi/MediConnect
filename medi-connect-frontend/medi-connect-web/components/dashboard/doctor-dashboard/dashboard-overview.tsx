"use client";

import Link from "next/link";
import { CalendarDays, Plus } from "lucide-react";

import { DashboardActivityPanels } from "@/components/dashboard/doctor-dashboard/overview/dashboard-activity-panels";
import { DashboardAppointments } from "@/components/dashboard/doctor-dashboard/overview/dashboard-appointments";
import { DashboardMetrics } from "@/components/dashboard/doctor-dashboard/overview/dashboard-metrics";
import { DashboardSidePanels } from "@/components/dashboard/doctor-dashboard/overview/dashboard-side-panels";
import { Button } from "@/components/ui/button";
import { useDoctorAppointments } from "@/hooks/apis/appointments/use-appointments";
import { getApiErrorMessage } from "@/lib/api-error";
import { getNextAppointment } from "@/lib/doctor-dashboard";

export function DashboardOverview() {
  const appointmentsQuery = useDoctorAppointments();
  const appointments = appointmentsQuery.data ?? [];
  const today = new Date().toISOString().slice(0, 10);
  const todayAppointments = appointments.filter(
    (appointment) => appointment.date === today,
  );
  const nextAppointment = getNextAppointment(appointments);
  const error = appointmentsQuery.isError
    ? getApiErrorMessage(
        appointmentsQuery.error,
        "The appointment overview could not be loaded.",
      )
    : null;

  return (
    <section
      aria-label="Doctor dashboard overview"
      className="w-full flex-1 space-y-5 px-4 py-6 sm:px-5 lg:px-6 2xl:px-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, Doctor
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s an overview of your practice today.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            render={<Link href="/dashboard/calendar" />}
            nativeButton={false}
            variant="outline"
            className="h-10 gap-2 px-4 text-sm"
          >
            <CalendarDays aria-hidden="true" />
            View calendar
          </Button>
          <Button
            render={<Link href="/dashboard/availability" />}
            nativeButton={false}
            className="h-10 gap-2 px-4 text-sm"
          >
            <Plus aria-hidden="true" />
            Add availability
          </Button>
        </div>
      </div>

      <DashboardMetrics appointments={appointments} />

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.8fr)_minmax(18rem,0.9fr)]">
        <DashboardAppointments
          appointments={todayAppointments}
          isLoading={appointmentsQuery.isPending}
          error={error}
          onRetry={() => void appointmentsQuery.refetch()}
        />
        <DashboardSidePanels nextAppointment={nextAppointment} />
      </div>

      <DashboardActivityPanels appointments={appointments} />
    </section>
  );
}
