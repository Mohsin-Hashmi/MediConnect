"use client";

import { CalendarDays, Clock3, UserRound } from "lucide-react";

import { StatusBadge } from "@/components/common/status-badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDoctorAppointment } from "@/hooks/apis/appointments/use-appointments";
import {
  formatAppointmentDate,
  formatAppointmentTime,
  getAppointmentDurationMinutes,
  getPatientAge,
} from "@/lib/appointment-format";
import type {
  ApiAppointmentStatus,
  AppointmentDetailsDialogProps,
} from "@/types/appointment";
import type { StatusTone } from "@/types/common";

const statusTones: Record<ApiAppointmentStatus, StatusTone> = {
  CONFIRMED: "info",
  PENDING: "warning",
  COMPLETED: "success",
  CANCELLED: "danger",
};

export function AppointmentDetailsDialog({
  appointment,
  onClose,
}: AppointmentDetailsDialogProps) {
  const appointmentId = appointment?.appointment.id;
  const {
    data: appointmentDetails,
    isFetching,
    isError,
  } = useDoctorAppointment(appointmentId);
  const item = appointmentDetails ?? appointment;
  const patientAge = getPatientAge(item?.patient?.dateOfBirth);

  return (
    <Dialog open={appointment !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-6 sm:max-w-lg">
        {item ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Appointment details</DialogTitle>
              <DialogDescription>Booking reference {item.appointment.id}</DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">
              <div>
                <p className="font-semibold text-foreground">{item.patient?.name ?? "Patient unavailable"}</p>
                <p className="text-sm text-muted-foreground">
                  {item.appointment.patientId}{patientAge !== null ? ` · ${patientAge} years` : ""}
                </p>
              </div>
              <StatusBadge status={item.appointment.status.toLowerCase()} tone={statusTones[item.appointment.status]} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex gap-3">
                <CalendarDays className="mt-0.5 size-4 text-primary" aria-hidden="true" />
                <div><p className="text-xs text-muted-foreground">Date</p><p className="font-medium">{formatAppointmentDate(item.appointment.date)}</p></div>
              </div>
              <div className="flex gap-3">
                <Clock3 className="mt-0.5 size-4 text-primary" aria-hidden="true" />
                <div>
                  <p className="text-xs text-muted-foreground">Time &amp; duration</p>
                  <p className="font-medium">{formatAppointmentTime(item.appointment.startTime)} · {getAppointmentDurationMinutes(item.appointment.startTime, item.appointment.endTime)} min</p>
                </div>
              </div>
              <div className="flex gap-3 sm:col-span-2">
                <UserRound className="mt-0.5 size-4 text-primary" aria-hidden="true" />
                <div><p className="text-xs text-muted-foreground">Reason for visit</p><p className="font-medium">{item.appointment.reason?.trim() || "No reason provided"}</p></div>
              </div>
            </div>
            {item.appointment.notes ? (
              <div className="border-t pt-4"><p className="text-xs text-muted-foreground">Patient notes</p><p className="mt-1 text-sm">{item.appointment.notes}</p></div>
            ) : null}
            {item.appointment.cancellationReason ? (
              <div className="rounded-lg border border-red-100 bg-red-50 p-3"><p className="text-xs font-medium text-red-700">Cancellation reason</p><p className="mt-1 text-sm text-red-900">{item.appointment.cancellationReason}</p></div>
            ) : null}
            {isFetching ? <p className="border-t pt-4 text-xs text-muted-foreground">Refreshing appointment details...</p> : null}
            {isError ? <p className="border-t pt-4 text-xs text-amber-700">The latest details could not be loaded. Showing the list data.</p> : null}
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
