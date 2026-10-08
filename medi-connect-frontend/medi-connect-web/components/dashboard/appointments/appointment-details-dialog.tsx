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
  return (
    <Dialog
      open={appointment !== null}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto p-6 sm:max-w-lg">
        {appointment ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Appointment details
              </DialogTitle>
              <DialogDescription>
                Demo booking reference {appointment.id}
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">
              <div>
                <p className="font-semibold text-foreground">
                  {appointment.patientName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {appointment.patientId} · {appointment.patientAge} years
                </p>
              </div>
              <StatusBadge
                status={appointment.status}
                tone={statusTones[appointment.status]}
              />
            </div>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="flex gap-3">
                <CalendarDays
                  className="mt-0.5 size-4 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-xs text-muted-foreground">Date</dt>
                  <dd className="font-medium">
                    {formatAppointmentDate(appointment.date)}
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock3
                  className="mt-0.5 size-4 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-xs text-muted-foreground">
                    Time &amp; duration
                  </dt>
                  <dd className="font-medium">
                    {formatAppointmentTime(appointment.time)} ·{" "}
                    {appointment.durationMinutes} min
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Video
                  className="mt-0.5 size-4 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-xs text-muted-foreground">Visit type</dt>
                  <dd className="font-medium">{appointment.visitType}</dd>
                </div>
              </div>
              <div className="flex gap-3">
                <CreditCard
                  className="mt-0.5 size-4 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-xs text-muted-foreground">
                    Consultation fee
                  </dt>
                  <dd className="font-medium">
                    {formatAppointmentFee(appointment.feePkr)}
                  </dd>
                </div>
              </div>
              <div className="flex gap-3 sm:col-span-2">
                <UserRound
                  className="mt-0.5 size-4 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-xs text-muted-foreground">
                    Reason for visit
                  </dt>
                  <dd className="font-medium">{appointment.reason}</dd>
                </div>
              </div>
            </dl>
            <p className="border-t pt-4 text-xs text-muted-foreground">
              This is sample information. Booking changes and video visits will
              be connected when the appointments API is available.
            </p>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
