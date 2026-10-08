"use client";

import { Eye, MoreVertical, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AppointmentActionsProps } from "@/types/appointment";

export function AppointmentActions({
  appointment,
  onView,
  onEdit,
  onDelete,
}: AppointmentActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9"
            aria-label={`Actions for ${appointment.patientName}`}
          />
        }
      >
        <MoreVertical className="size-4" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36 p-1.5">
        <DropdownMenuItem
          className="min-h-9 gap-2 px-2.5"
          onClick={() => onView(appointment)}
        >
          <Eye className="size-4" aria-hidden="true" />
          View
        </DropdownMenuItem>
        {onEdit ? (
          <DropdownMenuItem
            className="min-h-9 gap-2 px-2.5"
            onClick={() => onEdit(appointment)}
          >
            <Pencil className="size-4" aria-hidden="true" />
            Edit
          </DropdownMenuItem>
        ) : null}
        {onDelete ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              className="min-h-9 gap-2 px-2.5"
              onClick={() => onDelete(appointment)}
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Delete
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
