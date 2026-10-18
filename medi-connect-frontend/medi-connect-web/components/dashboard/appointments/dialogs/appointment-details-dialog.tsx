"use client";

import {
  CalendarDays,
  Clock3,
  CreditCard,
  UserRound,
  Video,
} from "lucide-react";

import { StatusBadge } from "@/components/common/status-badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  formatAppointmentDate,
  formatAppointmentFee,
  formatAppointmentTime,
} from "@/lib/appointment-format";
import { useDoctorAppointment } from "@/hooks/apis/appointments/use-appointments";
import type {
  AppointmentDetailsDialogProps,
  AppointmentRecord,
} from "@/types/appointment";
import type { StatusTone } from "@/types/common";

const statusTones: Record<AppointmentRecord["status"], StatusTone> = {
  confirmed: "info",
  pending: "warning",
  completed: "success",
  cancelled: "danger",
};

export function AppointmentDetailsDialog({
  appointment,
  onClose,
}: AppointmentDetailsDialogProps) {
  const {
    data: appointmentDetails,
    isFetching,
    isError,
  } = useDoctorAppointment(appointment?.id);
  const displayedAppointment = appointmentDetails ?? appointment;

  return (
    <Dialog
      open={appointment !== null}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto p-6 sm:max-w-lg">
        {displayedAppointment ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Appointment details
              </DialogTitle>
              <DialogDescription>
                Booking reference {displayedAppointment.id}
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">
              <div>
                <p className="font-semibold text-foreground">
                  {displayedAppointment.patientName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {displayedAppointment.patientId}
                  {displayedAppointment.patientAge !== null
                    ? ` · ${displayedAppointment.patientAge} years`
                    : ""}
                </p>
              </div>
              <StatusBadge
                status={displayedAppointment.status}
                tone={statusTones[displayedAppointment.status]}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex gap-3">
                <CalendarDays
                  className="mt-0.5 size-4 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {formatAppointmentDate(displayedAppointment.date)}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock3
                  className="mt-0.5 size-4 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Time &amp; duration
                  </p>
                  <p className="font-medium">
                    {formatAppointmentTime(displayedAppointment.time)} ·{" "}
                    {displayedAppointment.durationMinutes} min
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Video
                  className="mt-0.5 size-4 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs text-muted-foreground">Visit type</p>
                  <p className="font-medium">
                    {displayedAppointment.visitType ?? "Not specified"}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CreditCard
                  className="mt-0.5 size-4 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Consultation fee
                  </p>
                  <p className="font-medium">
                    {displayedAppointment.feePkr === null
                      ? "Not recorded"
                      : formatAppointmentFee(displayedAppointment.feePkr)}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 sm:col-span-2">
                <UserRound
                  className="mt-0.5 size-4 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Reason for visit
                  </p>
                  <p className="font-medium">{displayedAppointment.reason}</p>
                </div>
              </div>
            </div>
            {displayedAppointment.notes ? (
              <div className="border-t pt-4">
                <p className="text-xs text-muted-foreground">Patient notes</p>
                <p className="mt-1 text-sm">{displayedAppointment.notes}</p>
              </div>
            ) : null}
            {displayedAppointment.cancellationReason ? (
              <div className="rounded-lg border border-red-100 bg-red-50 p-3">
                <p className="text-xs font-medium text-red-700">
                  Cancellation reason
                </p>
                <p className="mt-1 text-sm text-red-900">
                  {displayedAppointment.cancellationReason}
                </p>
              </div>
            ) : null}
            {isFetching ? (
              <p className="border-t pt-4 text-xs text-muted-foreground">
                Refreshing appointment details...
              </p>
            ) : null}
            {isError ? (
              <p className="border-t pt-4 text-xs text-amber-700">
                The latest details could not be loaded. Showing the list data.
              </p>
            ) : null}
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
