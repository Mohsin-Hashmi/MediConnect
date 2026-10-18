"use client";

import { Ban, Check, CircleCheckBig, Eye, MoreVertical } from "lucide-react";

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
  onConfirm,
  onComplete,
  onCancel,
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
        {appointment.status === "pending" && onConfirm ? (
          <DropdownMenuItem
            className="min-h-9 gap-2 px-2.5"
            onClick={() => onConfirm(appointment)}
          >
            <Check className="size-4" aria-hidden="true" />
            Confirm
          </DropdownMenuItem>
        ) : null}
        {appointment.status === "confirmed" && onComplete ? (
          <DropdownMenuItem
            className="min-h-9 gap-2 px-2.5"
            onClick={() => onComplete(appointment)}
          >
            <CircleCheckBig className="size-4" aria-hidden="true" />
            Mark completed
          </DropdownMenuItem>
        ) : null}
        {(appointment.status === "pending" ||
          appointment.status === "confirmed") &&
        onCancel ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              className="min-h-9 gap-2 px-2.5"
              onClick={() => onCancel(appointment)}
            >
              <Ban className="size-4" aria-hidden="true" />
              Cancel appointment
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
