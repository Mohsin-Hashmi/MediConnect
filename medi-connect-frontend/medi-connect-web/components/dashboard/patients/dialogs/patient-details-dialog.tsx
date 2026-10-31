import { format, parseISO } from "date-fns";

import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getPatientAge } from "@/lib/appointment-format";
import type { ApiDoctorPatient } from "@/types/patient";

export function PatientDetailsDialog({ patient: item, onClose }: { patient: ApiDoctorPatient | null; onClose: () => void }) {
  const age = getPatientAge(item?.patient.dateOfBirth);

  return (
    <Dialog open={item !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>Patient details</DialogTitle><DialogDescription>Read-only information shared through this patient&apos;s appointments.</DialogDescription></DialogHeader>
        {item ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4"><div><p className="text-lg font-semibold">{item.patient.name}</p><p className="text-sm text-muted-foreground">{item.patient.id}</p></div><StatusBadge status={item.appointmentSummary.latest.status.toLowerCase()} /></div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Age and gender", `${age ?? "Unavailable"}${age !== null ? " years" : ""} · ${item.patient.gender ?? "Unavailable"}`],
                ["Email", item.patient.email ?? "Not provided"],
                ["Phone", item.patient.phone ?? "Not provided"],
                ["Latest appointment", format(parseISO(item.appointmentSummary.latest.date), "d MMMM yyyy")],
                ["Latest reason", item.appointmentSummary.latest.reason?.trim() || "No reason provided"],
                ["Total appointments", String(item.appointmentSummary.total)],
              ].map(([label, value]) => <div key={label} className="min-w-0 rounded-lg border p-3"><p className="text-xs font-medium text-muted-foreground">{label}</p><p className="mt-1 break-words text-sm font-medium">{value}</p></div>)}
            </div>
          </div>
        ) : null}
        <DialogFooter><Button type="button" variant="outline" onClick={onClose}>Close</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
