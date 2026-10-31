"use client";

import { CalendarDays } from "lucide-react";

import { cn } from "@/lib/utils";
import type { DoctorAppointmentApiItem } from "@/types/appointment";

export function CalendarEventCard({
  appointment: item,
  onClick,
  compact = false,
}: {
  appointment: DoctorAppointmentApiItem;
  onClick: () => void;
  compact?: boolean;
}) {
  const { appointment, patient } = item;
  const patientName = patient?.name ?? "Patient unavailable";

  return (
    <button
      type="button"
      onClick={onClick}
      title={`${patientName} · ${appointment.startTime} · ${appointment.reason?.trim() || "No reason provided"}`}
      className={cn(
        "flex w-full min-w-0 flex-col overflow-hidden rounded-md border-l-[3px] px-2 py-1 text-left shadow-sm transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary",
        "border-blue-500 bg-blue-50 text-blue-900",
        appointment.status === "PENDING" &&
          "border-amber-500 bg-amber-50 text-amber-900",
        appointment.status === "COMPLETED" &&
          "border-slate-400 bg-slate-100 text-slate-700",
        appointment.status === "CANCELLED" &&
          "border-rose-400 bg-rose-50 text-rose-600 line-through opacity-70",
        compact ? "text-[11px]" : "text-xs",
      )}
    >
      <span className="flex min-w-0 items-center gap-1 font-semibold">
        <CalendarDays className="size-3 shrink-0" aria-hidden="true" />
        <span className="truncate">{patientName}</span>
      </span>
      {!compact ? (
        <span className="truncate opacity-80">
          {appointment.startTime} · {appointment.reason?.trim() || "No reason provided"}
        </span>
      ) : null}
    </button>
  );
}
