"use client";

import { Pencil } from "lucide-react";

import { EditAppointmentForm } from "@/components/dashboard/appointments/edit-appointment-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { EditAppointmentDrawerProps } from "@/types/appointment";

export function EditAppointmentDrawer({
  appointment,
  onClose,
  onSave,
}: EditAppointmentDrawerProps) {
  return (
    <Sheet
      open={appointment !== null}
      onOpenChange={(open) => !open && onClose()}
    >
      <SheetContent
        side="right"
        className="gap-0 p-0 data-[side=right]:w-full data-[side=right]:sm:w-[min(44rem,100vw)] data-[side=right]:sm:max-w-176"
      >
        <SheetHeader className="border-b px-5 py-5 pr-12 sm:px-7 sm:py-6">
          <SheetTitle className="flex items-center gap-2 text-xl font-semibold">
            <Pencil className="size-5 text-primary" aria-hidden="true" />
            Edit appointment
          </SheetTitle>
          <SheetDescription>
            Update {appointment?.id ?? "this appointment"} and review the
            changes before saving.
          </SheetDescription>
        </SheetHeader>
        {appointment ? (
          <EditAppointmentForm
            key={appointment.id}
            appointment={appointment}
            onClose={onClose}
            onSave={onSave}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
