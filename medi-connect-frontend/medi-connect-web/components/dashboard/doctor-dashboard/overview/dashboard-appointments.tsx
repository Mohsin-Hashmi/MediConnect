import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Error as ErrorState } from "@/components/common/error";
import { Loader } from "@/components/common/loader";
import { NoDataFound } from "@/components/common/no-data-found";
import { StatusBadge } from "@/components/common/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatAppointmentTime } from "@/lib/appointment-format";
import type { ApiAppointmentStatus } from "@/types/appointment";
import type { StatusTone } from "@/types/common";
import type { DashboardAppointmentsProps, DashboardPatientAvatarProps } from "@/types/doctor-dashboard";

const avatarClasses = [
  "bg-blue-100 text-blue-700",
  "bg-teal-100 text-teal-700",
  "bg-amber-100 text-amber-700",
  "bg-violet-100 text-violet-700",
] as const;

const appointmentStatusTones: Record<ApiAppointmentStatus, StatusTone> = {
  CONFIRMED: "info",
  PENDING: "warning",
  COMPLETED: "neutral",
  CANCELLED: "danger",
};

function PatientAvatar({ appointment: item }: DashboardPatientAvatarProps) {
  const patientName = item.patient?.name ?? "Patient unavailable";
  const initials = patientName.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const toneIndex = [...item.appointment.patientId].reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  ) % avatarClasses.length;

  return (
    <Avatar className="size-9">
      <AvatarFallback className={`text-xs font-semibold ${avatarClasses[toneIndex]}`}>{initials}</AvatarFallback>
    </Avatar>
  );
}

export function DashboardAppointments({ appointments, isLoading = false, error = null, onRetry }: DashboardAppointmentsProps) {
  const visibleAppointments = appointments.slice(0, 5);

  return (
    <Card className="min-w-0 gap-0 border-0 py-0 shadow-sm ring-1 ring-slate-200/90">
      <CardHeader className="flex flex-row flex-wrap items-center gap-3 border-b px-5 py-4">
        <div><CardTitle className="font-semibold">Today&apos;s Appointments</CardTitle><CardDescription className="mt-1 text-xs">Patient-booked consultations for today</CardDescription></div>
        <CardAction className="ml-auto self-center"><Link href="/dashboard/appointments" className="inline-flex min-h-9 items-center gap-1.5 text-sm font-semibold text-primary hover:underline">View all<ArrowRight className="size-3.5" aria-hidden="true" /></Link></CardAction>
      </CardHeader>
      <CardContent className="px-0">
        {isLoading ? (
          <Loader label="Loading today's appointments..." rows={4} />
        ) : error ? (
          <ErrorState title="Could not load today's appointments" message={error} onRetry={onRetry} />
        ) : visibleAppointments.length === 0 ? (
          <NoDataFound title="No appointments today" description="Patient bookings scheduled for today will appear here." />
        ) : (
          <>
            <div className="hidden md:block">
              <Table>
                <TableHeader className="bg-slate-50/80"><TableRow className="hover:bg-transparent"><TableHead className="pl-5 text-xs text-muted-foreground">Patient</TableHead><TableHead className="text-xs text-muted-foreground">Time</TableHead><TableHead className="text-xs text-muted-foreground">Status</TableHead><TableHead className="pr-5 text-right text-xs text-muted-foreground">Action</TableHead></TableRow></TableHeader>
                <TableBody>
                  {visibleAppointments.map((item) => (
                    <TableRow key={item.appointment.id}>
                      <TableCell className="pl-5"><div className="flex min-w-44 items-center gap-2.5"><PatientAvatar appointment={item} /><div className="min-w-0"><p className="truncate font-semibold text-foreground">{item.patient?.name ?? "Patient unavailable"}</p><p className="truncate text-xs text-muted-foreground">{item.appointment.reason?.trim() || "No reason provided"}</p></div></div></TableCell>
                      <TableCell className="text-xs font-medium text-foreground">{formatAppointmentTime(item.appointment.startTime)}</TableCell>
                      <TableCell><StatusBadge status={item.appointment.status.toLowerCase()} tone={appointmentStatusTones[item.appointment.status]} /></TableCell>
                      <TableCell className="pr-5 text-right"><Button render={<Link href="/dashboard/appointments" />} nativeButton={false} variant="outline" className="h-9 px-4 text-sm" aria-label={`View appointment for ${item.patient?.name ?? "patient"}`}>View</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="divide-y md:hidden">
              {visibleAppointments.map((item) => (
                <div key={item.appointment.id} className="flex items-center gap-3 px-5 py-3.5">
                  <PatientAvatar appointment={item} />
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item.patient?.name ?? "Patient unavailable"}</p><p className="truncate text-xs text-muted-foreground">{item.appointment.reason?.trim() || "No reason provided"}</p><p className="mt-1 text-xs text-muted-foreground">{formatAppointmentTime(item.appointment.startTime)}</p></div>
                  <StatusBadge status={item.appointment.status.toLowerCase()} tone={appointmentStatusTones[item.appointment.status]} />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between gap-3 border-t px-5 py-3 text-xs text-muted-foreground"><span>Showing {visibleAppointments.length} of {appointments.length} appointments today</span><Link href="/dashboard/appointments" className="inline-flex min-h-9 shrink-0 items-center text-sm font-semibold text-primary hover:underline">View all</Link></div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
