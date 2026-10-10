import { format, parseISO } from "date-fns";

import { NoDataFound } from "@/components/common/no-data-found";
import { StatusBadge } from "@/components/common/status-badge";
import { PatientActions } from "@/components/dashboard/patients/list/patient-actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PatientIdentityProps, PatientListProps } from "@/types/patient";

function displayDate(date: string | null) {
  return date ? format(parseISO(date), "d MMM yyyy") : "Not scheduled";
}

function PatientIdentity({ patient }: PatientIdentityProps) {
  const initials = patient.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar className="size-9 shrink-0">
        <AvatarFallback className="bg-blue-100 text-xs font-semibold text-blue-700">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate font-semibold text-foreground">{patient.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {patient.age} years · {patient.gender} · {patient.id}
        </p>
      </div>
    </div>
  );
}

export function PatientList({
  patients,
  onView,
  onEdit,
  onDelete,
  onResetFilters,
}: PatientListProps) {
  if (patients.length === 0) {
    return (
      <NoDataFound
        title="No patients found"
        description={
          onResetFilters
            ? "Try a different search term or clear your filters."
            : "There are no patients to show yet."
        }
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
              <TableHead className="pl-5 text-xs tracking-wide text-muted-foreground uppercase">
                Patient
              </TableHead>
              <TableHead className="text-xs tracking-wide text-muted-foreground uppercase">
                Care focus
              </TableHead>
              <TableHead className="text-xs tracking-wide text-muted-foreground uppercase">
                Last visit
              </TableHead>
              <TableHead className="text-xs tracking-wide text-muted-foreground uppercase">
                Next appointment
              </TableHead>
              <TableHead className="text-xs tracking-wide text-muted-foreground uppercase">
                Visits
              </TableHead>
              <TableHead className="text-xs tracking-wide text-muted-foreground uppercase">
                Status
              </TableHead>
              <TableHead className="pr-5 text-right text-xs tracking-wide text-muted-foreground uppercase">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="max-w-60 pl-5">
                  <PatientIdentity patient={patient} />
                </TableCell>
                <TableCell className="max-w-48">
                  <p className="truncate font-medium text-foreground">
                    {patient.careFocus}
                  </p>
                </TableCell>
                <TableCell className="text-foreground">
                  {patient.lastVisitDate ? (
                    displayDate(patient.lastVisitDate)
                  ) : (
                    <span className="text-muted-foreground">No visits yet</span>
                  )}
                </TableCell>
                <TableCell className="text-foreground">
                  {patient.nextAppointmentDate ? (
                    displayDate(patient.nextAppointmentDate)
                  ) : (
                    <span className="text-muted-foreground">Not scheduled</span>
                  )}
                </TableCell>
                <TableCell className="tabular-nums text-foreground">
                  {patient.visitCount}
                </TableCell>
                <TableCell>
                  <StatusBadge
                    status={patient.status}
                    tone={patient.status === "active" ? "success" : "neutral"}
                  />
                </TableCell>
                <TableCell className="pr-5 text-right">
                  <PatientActions
                    patient={patient}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="divide-y xl:hidden">
        {patients.map((patient) => (
          <div key={patient.id} className="space-y-3 px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <PatientIdentity patient={patient} />
              <div className="flex shrink-0 items-center gap-2">
                <StatusBadge
                  status={patient.status}
                  tone={patient.status === "active" ? "success" : "neutral"}
                />
                <PatientActions
                  patient={patient}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </div>
            </div>
            <p className="text-sm font-medium text-foreground">
              {patient.careFocus}
            </p>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>
                Last visit:{" "}
                {patient.lastVisitDate
                  ? displayDate(patient.lastVisitDate)
                  : "No visits yet"}
              </span>
              <span>Next: {displayDate(patient.nextAppointmentDate)}</span>
              <span className="font-semibold text-foreground">
                {patient.visitCount} visits
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
