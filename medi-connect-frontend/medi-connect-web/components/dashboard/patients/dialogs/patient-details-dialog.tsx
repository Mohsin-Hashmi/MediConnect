import { format, parseISO } from "date-fns";

import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { PatientRecord } from "@/types/patient";

export function PatientDetailsDialog({ patient, onClose }: { patient: PatientRecord | null; onClose: () => void }) {
  return (
    <Dialog open={patient !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>Patient details</DialogTitle><DialogDescription>Read-only information shared through this patient&apos;s appointments.</DialogDescription></DialogHeader>
        {patient ? <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4"><div><p className="text-lg font-semibold">{patient.name}</p><p className="text-sm text-muted-foreground">{patient.id}</p></div><StatusBadge status={patient.latestAppointmentStatus} /></div>
          <div className="grid gap-3 sm:grid-cols-2">{[
            ["Age and gender", `${patient.age ?? "Unavailable"}${patient.age !== null ? " years" : ""} · ${patient.gender ?? "Unavailable"}`],
            ["Email", patient.email ?? "Not provided"], ["Phone", patient.phone ?? "Not provided"],
            ["Latest appointment", format(parseISO(patient.latestAppointmentDate), "d MMMM yyyy")],
            ["Latest reason", patient.latestReason], ["Total appointments", String(patient.appointmentCount)],
          ].map(([label, value]) => <div key={label} className="min-w-0 rounded-lg border p-3"><p className="text-xs font-medium text-muted-foreground">{label}</p><p className="mt-1 break-words text-sm font-medium">{value}</p></div>)}</div>
        </div> : null}
        <DialogFooter><Button type="button" variant="outline" onClick={onClose}>Close</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
