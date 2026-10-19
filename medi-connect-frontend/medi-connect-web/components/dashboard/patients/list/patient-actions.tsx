"use client";

import { Eye, MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PatientActionsProps } from "@/types/patient";

export function PatientActions({ patient, onView }: PatientActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9"
            aria-label={`Actions for ${patient.name}`}
          />
        }
      >
        <MoreVertical className="size-4" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36 p-1.5">
        <DropdownMenuItem
          className="min-h-9 gap-2 px-2.5"
          onClick={() => onView(patient)}
        >
          <Eye className="size-4" aria-hidden="true" />
          View
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
