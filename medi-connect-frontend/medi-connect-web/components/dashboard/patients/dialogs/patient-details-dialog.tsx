import { format, parseISO } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PatientRecord } from "@/types/patient";

interface Props {
  patient: PatientRecord | null;
  onClose: () => void;
  onEdit: (patient: PatientRecord) => void;
}

function dateLabel(value: string | null) {
  return value ? format(parseISO(value), "d MMMM yyyy") : "Not scheduled";
}

export function PatientDetailsDialog({ patient, onClose, onEdit }: Props) {
  return (
    <Dialog
      open={patient !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Patient details</DialogTitle>
          <DialogDescription>
            Patient information currently available on this page.
          </DialogDescription>
        </DialogHeader>
        {patient ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
              <div>
                <p className="text-lg font-semibold">{patient.name}</p>
                <p className="text-sm text-slate-500">{patient.id}</p>
              </div>
              <Badge variant="outline">{patient.status}</Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Age & gender", `${patient.age} years · ${patient.gender}`],
                ["Email", patient.email],
                ["Care focus", patient.careFocus],
                ["Total visits", String(patient.visitCount)],
                ["Last visit", dateLabel(patient.lastVisitDate)],
                ["Next appointment", dateLabel(patient.nextAppointmentDate)],
                ["Registered", dateLabel(patient.registeredAt)],
              ].map(([label, value]) => (
                <div key={label} className="min-w-0 rounded-lg border p-3">
                  <p className="text-xs font-medium text-slate-500">{label}</p>
                  <p className="mt-1 wrap-break-words text-sm font-medium text-slate-900">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
          {patient ? (
            <Button
              type="button"
              onClick={() => {
                onClose();
                onEdit(patient);
              }}
            >
              Edit patient
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
