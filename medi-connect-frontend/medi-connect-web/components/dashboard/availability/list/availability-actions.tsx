"use client";

import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AvailabilityActionsProps } from "@/types/availability";

export function AvailabilityActions({
  availability,
  onEdit,
  onDelete,
}: AvailabilityActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9"
            aria-label={`Actions for availability on ${availability.date}`}
          />
        }
      >
        <MoreVertical className="size-4" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36 p-1.5">
        <DropdownMenuItem
          className="min-h-9 gap-2 px-2.5"
          onClick={() => onEdit(availability)}
        >
          <Pencil className="size-4" aria-hidden="true" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="min-h-9 gap-2 px-2.5"
          onClick={() => onDelete(availability)}
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
