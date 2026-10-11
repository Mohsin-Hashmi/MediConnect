"use client";

import { PatientForm } from "@/components/dashboard/patients/forms/patient-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PatientFormDialogProps } from "@/types/patient";

export function PatientFormDialog({ open, onClose, onSave }: PatientFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add patient</DialogTitle>
          <DialogDescription>
            This is a form preview. Nothing is saved until the patient API is
            connected. Do not enter real patient information yet.
          </DialogDescription>
        </DialogHeader>
        <PatientForm key={open ? "new-patient-open" : "new-patient-closed"} patient={null} variant="dialog" onClose={onClose} onSave={onSave} />
      </DialogContent>
    </Dialog>
  );
}
