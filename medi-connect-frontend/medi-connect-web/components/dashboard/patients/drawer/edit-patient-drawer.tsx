"use client";

import { Pencil } from "lucide-react";

import { PatientForm } from "@/components/dashboard/patients/forms/patient-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { EditPatientDrawerProps } from "@/types/patient";

export function EditPatientDrawer({ patient, onClose, onSave }: EditPatientDrawerProps) {
  return (
    <Sheet open={patient !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="gap-0 p-0 data-[side=right]:w-full data-[side=right]:sm:w-[min(44rem,100vw)] data-[side=right]:sm:max-w-176"
      >
        <SheetHeader className="border-b px-5 py-5 pr-12 sm:px-7 sm:py-6">
          <SheetTitle className="flex items-center gap-2 text-xl font-semibold">
            <Pencil className="size-5 text-primary" aria-hidden="true" />
            Edit patient
          </SheetTitle>
          <SheetDescription>
            Review {patient?.id ?? "this patient"} and preview changes to the
            patient record. Nothing is saved until the patient API is connected.
          </SheetDescription>
        </SheetHeader>
        {patient ? (
          <PatientForm
            key={patient.id}
            patient={patient}
            variant="drawer"
            onClose={onClose}
            onSave={onSave}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
