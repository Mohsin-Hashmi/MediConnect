import { Building2, Video } from "lucide-react";

import { Error as ErrorState } from "@/components/common/error";
import { Loader } from "@/components/common/loader";
import { NoDataFound } from "@/components/common/no-data-found";
import { StatusBadge } from "@/components/common/status-badge";
import { AppointmentActions } from "@/components/dashboard/appointments/appointment-actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatAppointmentDate,
  formatAppointmentFee,
  formatAppointmentTime,
} from "@/lib/appointment-format";
import type {
  AppointmentListProps,
  AppointmentPatientCellProps,
  AppointmentRecord,
} from "@/types/appointment";
import type { StatusTone } from "@/types/common";

const avatarClasses = {
  blue: "bg-blue-100 text-blue-700",
  teal: "bg-teal-100 text-teal-700",
  amber: "bg-amber-100 text-amber-700",
  violet: "bg-violet-100 text-violet-700",
} as const;

const statusTones: Record<AppointmentRecord["status"], StatusTone> = {
  confirmed: "info",
  pending: "warning",
  completed: "success",
  cancelled: "danger",
};

function PatientCell({ appointment }: AppointmentPatientCellProps) {
  const initials = appointment.patientName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar className="size-9 shrink-0">
        <AvatarFallback
          className={`text-xs font-semibold ${avatarClasses[appointment.avatarTone]}`}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate font-semibold text-foreground">
          {appointment.patientName}
        </p>
        <p className="text-xs text-muted-foreground">
          {appointment.patientAge} years · {appointment.patientId}
        </p>
      </div>
    </div>
  );
}

export function AppointmentList({
  appointments,
  onView,
  onEdit,
  onDelete,
  onResetFilters,
  isLoading = false,
  error = null,
  onRetry,
}: AppointmentListProps) {
  if (isLoading) return <Loader label="Loading appointments..." />;
  if (error)
    return (
      <ErrorState
        title="Could not load appointments"
        message={error}
        onRetry={onRetry}
      />
    );

  if (appointments.length === 0) {
    return (
      <NoDataFound
        title="No appointments found"
        description={
          onResetFilters
            ? "Try a different search term or clear your filters."
            : "There are no appointments to show yet."
        }
        actionLabel={onResetFilters ? "Clear filters" : undefined}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <>
      <div className="hidden xl:block">
        <Table>
          <TableHeader className="bg-slate-50/90">
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-5 text-xs tracking-wide text-muted-foreground uppercase">
                Patient
              </TableHead>
              <TableHead className="text-xs tracking-wide text-muted-foreground uppercase">
                Date &amp; time
              </TableHead>
              <TableHead className="text-xs tracking-wide text-muted-foreground uppercase">
                Visit
              </TableHead>
              <TableHead className="text-xs tracking-wide text-muted-foreground uppercase">
                Status
              </TableHead>
              <TableHead className="text-xs tracking-wide text-muted-foreground uppercase">
                Fee
              </TableHead>
              <TableHead className="pr-5 text-right text-xs tracking-wide text-muted-foreground uppercase">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell className="max-w-58 pl-5">
                  <PatientCell appointment={appointment} />
                </TableCell>
                <TableCell>
                  <p className="font-medium text-foreground">
                    {formatAppointmentDate(appointment.date)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatAppointmentTime(appointment.time)} ·{" "}
                    {appointment.durationMinutes} min
                  </p>
                </TableCell>
                <TableCell className="max-w-50">
                  <p className="truncate font-medium text-foreground">
                    {appointment.reason}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    {appointment.visitType === "Video" ? (
                      <Video
                        className="size-3.5 text-primary"
                        aria-hidden="true"
                      />
                    ) : (
                      <Building2
                        className="size-3.5 text-secondary"
                        aria-hidden="true"
                      />
                    )}
                    {appointment.visitType}
                  </p>
                </TableCell>
                <TableCell>
                  <StatusBadge
                    status={appointment.status}
                    tone={statusTones[appointment.status]}
                  />
                </TableCell>
                <TableCell className="font-medium tabular-nums">
                  {formatAppointmentFee(appointment.feePkr)}
                </TableCell>
                <TableCell className="pr-5 text-right">
                  <AppointmentActions
                    appointment={appointment}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="divide-y xl:hidden">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="space-y-3 px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <PatientCell appointment={appointment} />
              <div className="flex shrink-0 items-center gap-2">
                <StatusBadge
                  status={appointment.status}
                  tone={statusTones[appointment.status]}
                />
                <AppointmentActions
                  appointment={appointment}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </div>
            </div>
            <p className="text-sm text-foreground">{appointment.reason}</p>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>
                {formatAppointmentDate(appointment.date)} ·{" "}
                {formatAppointmentTime(appointment.time)} ·{" "}
                {appointment.visitType}
              </span>
              <span className="font-semibold text-foreground">
                {formatAppointmentFee(appointment.feePkr)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
