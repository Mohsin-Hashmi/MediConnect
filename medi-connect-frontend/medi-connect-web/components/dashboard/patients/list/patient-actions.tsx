import { Eye, MoreVertical, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { PatientRecord } from "@/types/patient";

interface Props {
  patient: PatientRecord;
  onView: (patient: PatientRecord) => void;
  onEdit: (patient: PatientRecord) => void;
  onDelete: (patient: PatientRecord) => void;
}

export function PatientActions({ patient, onView, onEdit, onDelete }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button type="button" variant="outline" size="icon" className="size-9" aria-label={`Actions for ${patient.name}`} />}><MoreVertical className="size-4" aria-hidden="true" /></DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36 p-1.5">
        <DropdownMenuItem onClick={() => onView(patient)}><Eye className="size-4" />View</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(patient)}><Pencil className="size-4" />Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => onDelete(patient)}><Trash2 className="size-4" />Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
