import { format, parseISO } from "date-fns";

import { Error } from "@/components/common/error";
import { Loader } from "@/components/common/loader";
import { NoDataFound } from "@/components/common/no-data-found";
import { StatusBadge } from "@/components/common/status-badge";
import { PatientActions } from "@/components/dashboard/patients/list/patient-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getPatientAge } from "@/lib/appointment-format";
import type { PatientIdentityProps, PatientListProps } from "@/types/patient";

function PatientIdentity({ patient: item }: PatientIdentityProps) {
  const age = getPatientAge(item.patient.dateOfBirth);
  const initials = item.patient.name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar className="size-9 shrink-0">
        <AvatarImage src={item.patient.profileImage ?? undefined} alt="" />
        <AvatarFallback className="bg-blue-100 text-xs font-semibold text-blue-700">{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate font-semibold">{item.patient.name}</p>
        <p className="truncate text-xs text-muted-foreground">{age === null ? "Age unavailable" : `${age} years`} · {item.patient.gender ?? "Gender unavailable"}</p>
      </div>
    </div>
  );
}

export function PatientList({ patients, onView, onResetFilters, isLoading, error, onRetry }: PatientListProps) {
  if (isLoading) return <Loader label="Loading patients..." />;
  if (error) return <Error title="Could not load patients" message={error} onRetry={onRetry} />;
  if (patients.length === 0) {
    return <NoDataFound title="No patients found" description={onResetFilters ? "Try a different search or clear your filters." : "Patients with appointments will appear here."} actionLabel={onResetFilters ? "Clear filters" : undefined} onAction={onResetFilters} />;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-slate-50/90"><TableRow className="hover:bg-transparent"><TableHead className="pl-5">Patient</TableHead><TableHead>Latest appointment</TableHead><TableHead>Reason</TableHead><TableHead>Appointments</TableHead><TableHead>Status</TableHead><TableHead className="pr-5 text-right">Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          {patients.map((item) => (
            <TableRow key={item.patient.id}>
              <TableCell className="min-w-60 pl-5"><PatientIdentity patient={item} /></TableCell>
              <TableCell className="whitespace-nowrap">{format(parseISO(item.appointmentSummary.latest.date), "d MMM yyyy")}</TableCell>
              <TableCell className="max-w-64"><p className="truncate font-medium">{item.appointmentSummary.latest.reason?.trim() || "No reason provided"}</p></TableCell>
              <TableCell>{item.appointmentSummary.total}</TableCell>
              <TableCell><StatusBadge status={item.appointmentSummary.latest.status.toLowerCase()} /></TableCell>
              <TableCell className="pr-5 text-right"><PatientActions patient={item} onView={onView} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
