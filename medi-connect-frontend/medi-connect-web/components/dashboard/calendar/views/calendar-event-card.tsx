"use client";

import { Building2, Video } from "lucide-react";

import { cn } from "@/lib/utils";
import type { AppointmentRecord } from "@/types/appointment";

export function CalendarEventCard({
  appointment,
  onClick,
  compact = false,
}: {
  appointment: AppointmentRecord;
  onClick: () => void;
  compact?: boolean;
}) {
  const isVideo = appointment.visitType === "Video";
  return (
    <button
      type="button"
      onClick={onClick}
      title={`${appointment.patientName} · ${appointment.time} · ${appointment.reason}`}
      className={cn(
        "flex w-full min-w-0 flex-col overflow-hidden rounded-md border-l-[3px] px-2 py-1 text-left shadow-sm transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary",
        isVideo
          ? "border-blue-500 bg-blue-50 text-blue-900"
          : "border-teal-500 bg-teal-50 text-teal-900",
        appointment.status === "pending" &&
          "border-amber-500 bg-amber-50 text-amber-900",
        appointment.status === "completed" &&
          "border-slate-400 bg-slate-100 text-slate-700",
        appointment.status === "cancelled" &&
          "border-rose-400 bg-rose-50 text-rose-600 line-through opacity-70",
        compact ? "text-[11px]" : "text-xs",
      )}
    >
      <span className="flex min-w-0 items-center gap-1 font-semibold">
        {isVideo ? (
          <Video className="size-3 shrink-0" aria-hidden="true" />
        ) : (
          <Building2 className="size-3 shrink-0" aria-hidden="true" />
        )}
        <span className="truncate">{appointment.patientName}</span>
      </span>
      {!compact && (
        <span className="truncate opacity-80">
          {appointment.time} · {appointment.reason}
        </span>
      )}
    </button>
  );
}
