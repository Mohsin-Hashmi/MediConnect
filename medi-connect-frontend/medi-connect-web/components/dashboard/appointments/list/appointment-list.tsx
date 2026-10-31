import { Error as ErrorState } from "@/components/common/error";
import { Loader } from "@/components/common/loader";
import { NoDataFound } from "@/components/common/no-data-found";
import { StatusBadge } from "@/components/common/status-badge";
import { AppointmentActions } from "@/components/dashboard/appointments/list/appointment-actions";
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
  formatAppointmentTime,
  getAppointmentDurationMinutes,
  getPatientAge,
} from "@/lib/appointment-format";
import type {
  ApiAppointmentStatus,
  AppointmentListProps,
  AppointmentPatientCellProps,
} from "@/types/appointment";
import type { StatusTone } from "@/types/common";

const avatarClasses = {
  blue: "bg-blue-100 text-blue-700",
  teal: "bg-teal-100 text-teal-700",
  amber: "bg-amber-100 text-amber-700",
  violet: "bg-violet-100 text-violet-700",
} as const;

const statusTones: Record<ApiAppointmentStatus, StatusTone> = {
  CONFIRMED: "info",
  PENDING: "warning",
  COMPLETED: "success",
  CANCELLED: "danger",
};

function getAvatarTone(patientId: string): keyof typeof avatarClasses {
  const tones = Object.keys(avatarClasses) as (keyof typeof avatarClasses)[];
  const value = [...patientId].reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );
  return tones[value % tones.length];
}

function PatientCell({ appointment }: AppointmentPatientCellProps) {
  const patientName = appointment.patient?.name ?? "Patient unavailable";
  const patientAge = getPatientAge(appointment.patient?.dateOfBirth);
  const initials = patientName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar className="size-9 shrink-0">
        <AvatarFallback
          className={`text-xs font-semibold ${avatarClasses[getAvatarTone(appointment.appointment.patientId)]}`}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate font-semibold text-foreground">{patientName}</p>
        <p className="text-xs text-muted-foreground">
          {patientAge !== null ? `${patientAge} years · ` : ""}
          {appointment.appointment.patientId}
        </p>
      </div>
    </div>
  );
}

export function AppointmentList({
  appointments,
  onView,
  onConfirm,
  onComplete,
  onCancel,
  onResetFilters,
  isLoading = false,
  error = null,
  onRetry,
}: AppointmentListProps) {
  if (isLoading) return <Loader label="Loading appointments..." />;
  if (error) {
    return (
      <ErrorState title="Could not load appointments" message={error} onRetry={onRetry} />
    );
  }
  if (appointments.length === 0) {
    return (
      <NoDataFound
        title="No appointments found"
        description={onResetFilters ? "Try a different search term or clear your filters." : "There are no appointments to show yet."}
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
              <TableHead className="pl-5 text-xs tracking-wide text-muted-foreground uppercase">Patient</TableHead>
              <TableHead className="text-xs tracking-wide text-muted-foreground uppercase">Date &amp; time</TableHead>
              <TableHead className="text-xs tracking-wide text-muted-foreground uppercase">Reason</TableHead>
              <TableHead className="text-xs tracking-wide text-muted-foreground uppercase">Status</TableHead>
              <TableHead className="pr-5 text-right text-xs tracking-wide text-muted-foreground uppercase">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((item) => {
              const { appointment } = item;
              return (
                <TableRow key={appointment.id}>
                  <TableCell className="max-w-58 pl-5"><PatientCell appointment={item} /></TableCell>
                  <TableCell>
                    <p className="font-medium text-foreground">{formatAppointmentDate(appointment.date)}</p>
                    <p className="text-xs text-muted-foreground">{formatAppointmentTime(appointment.startTime)} · {getAppointmentDurationMinutes(appointment.startTime, appointment.endTime)} min</p>
                  </TableCell>
                  <TableCell className="max-w-64"><p className="truncate font-medium text-foreground">{appointment.reason?.trim() || "No reason provided"}</p></TableCell>
                  <TableCell><StatusBadge status={appointment.status.toLowerCase()} tone={statusTones[appointment.status]} /></TableCell>
                  <TableCell className="pr-5 text-right"><AppointmentActions appointment={item} onView={onView} onConfirm={onConfirm} onComplete={onComplete} onCancel={onCancel} /></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="divide-y xl:hidden">
        {appointments.map((item) => {
          const { appointment } = item;
          return (
            <div key={appointment.id} className="space-y-3 px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <PatientCell appointment={item} />
                <div className="flex shrink-0 items-center gap-2">
                  <StatusBadge status={appointment.status.toLowerCase()} tone={statusTones[appointment.status]} />
                  <AppointmentActions appointment={item} onView={onView} onConfirm={onConfirm} onComplete={onComplete} onCancel={onCancel} />
                </div>
              </div>
              <p className="text-sm text-foreground">{appointment.reason?.trim() || "No reason provided"}</p>
              <p className="text-xs text-muted-foreground">{formatAppointmentDate(appointment.date)} · {formatAppointmentTime(appointment.startTime)} · {getAppointmentDurationMinutes(appointment.startTime, appointment.endTime)} min</p>
            </div>
          );
        })}
      </div>
    </>
  );
}
