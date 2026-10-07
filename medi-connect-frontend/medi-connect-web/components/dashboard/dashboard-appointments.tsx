import Link from "next/link";
import { ArrowRight, Building2, Video } from "lucide-react";

import { StatusBadge, type StatusTone } from "@/components/common/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DashboardAppointment } from "@/types/doctor-dashboard";

const avatarClasses = {
  blue: "bg-blue-100 text-blue-700",
  teal: "bg-teal-100 text-teal-700",
  amber: "bg-amber-100 text-amber-700",
  violet: "bg-violet-100 text-violet-700",
} as const;

const appointmentStatusTones: Record<DashboardAppointment["status"], StatusTone> = {
  confirmed: "info",
  pending: "warning",
  completed: "neutral",
};

function PatientAvatar({ appointment }: { appointment: DashboardAppointment }) {
  return (
    <Avatar className="size-9">
      <AvatarFallback className={`text-xs font-semibold ${avatarClasses[appointment.avatarTone]}`}>
        {appointment.initials}
      </AvatarFallback>
    </Avatar>
  );
}

export function DashboardAppointments({
  appointments,
}: {
  appointments: DashboardAppointment[];
}) {
  const visibleAppointments = appointments.slice(0, 5);

  return (
    <Card className="min-w-0 gap-0 border-0 py-0 shadow-sm ring-1 ring-slate-200/90">
      <CardHeader className="flex flex-row flex-wrap items-center gap-3 border-b px-5 py-4">
        <div>
          <CardTitle className="font-semibold">Today&apos;s Appointments</CardTitle>
          <CardDescription className="mt-1 text-xs">Sample schedule</CardDescription>
        </div>
        <CardAction className="ml-auto self-center">
          <Link href="/dashboard/appointments" className="inline-flex min-h-9 items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            View all ({appointments.length})
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </CardAction>
      </CardHeader>

      <CardContent className="px-0">
        <div className="hidden md:block">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5 text-xs text-muted-foreground">Patient</TableHead>
                <TableHead className="text-xs text-muted-foreground">Time</TableHead>
                <TableHead className="text-xs text-muted-foreground">Type</TableHead>
                <TableHead className="text-xs text-muted-foreground">Status</TableHead>
                <TableHead className="pr-5 text-right text-xs text-muted-foreground">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="pl-5">
                    <div className="flex min-w-44 items-center gap-2.5">
                      <PatientAvatar appointment={appointment} />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-foreground">{appointment.patientName}</p>
                        <p className="truncate text-xs text-muted-foreground">{appointment.reason}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-foreground">{appointment.time}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      {appointment.visitType === "Video" ? <Video className="size-3.5 text-primary" aria-hidden="true" /> : <Building2 className="size-3.5 text-secondary" aria-hidden="true" />}
                      {appointment.visitType}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={appointment.status} tone={appointmentStatusTones[appointment.status]} />
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <Button
                      render={<Link href="/dashboard/appointments" />}
                      variant="outline"
                      className="h-9 px-4 text-sm"
                      aria-label={`View appointment for ${appointment.patientName}`}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="divide-y md:hidden">
          {visibleAppointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center gap-3 px-5 py-3.5">
              <PatientAvatar appointment={appointment} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{appointment.patientName}</p>
                <p className="truncate text-xs text-muted-foreground">{appointment.reason}</p>
                <p className="mt-1 text-xs text-muted-foreground">{appointment.time} | {appointment.visitType}</p>
              </div>
              <StatusBadge status={appointment.status} tone={appointmentStatusTones[appointment.status]} />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-t px-5 py-3 text-xs text-muted-foreground">
          <span>Showing {visibleAppointments.length} of {appointments.length} sample appointments</span>
          <Link href="/dashboard/appointments" className="inline-flex min-h-9 shrink-0 items-center text-sm font-semibold text-primary hover:underline">
            View all
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
