"use client";

import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatAppointmentTime } from "@/lib/appointment-format";
import { calendarDateKey } from "@/lib/calendar-schedule";
import type { CalendarSidebarProps } from "@/types/calendar";

export function CalendarSidebar({
  date,
  appointments,
  onSelectDate,
  onSelectAppointment,
}: CalendarSidebarProps) {
  const dateKey = calendarDateKey(date);
  const selectedDayAppointments = appointments
    .filter(
      (item) =>
        item.appointment.date.slice(0, 10) === dateKey &&
        item.appointment.status !== "CANCELLED",
    )
    .sort((first, second) =>
      first.appointment.startTime.localeCompare(second.appointment.startTime),
    );

  return (
    <aside aria-label="Calendar details" className="space-y-4">
      <Card className="gap-0 border-0 bg-white py-0 shadow-sm ring-1 ring-slate-200">
        <CardContent className="flex justify-center p-2">
          <Calendar mode="single" selected={date} month={date} onMonthChange={onSelectDate} onSelect={(selected) => selected && onSelectDate(selected)} className="[--cell-size:2rem] sm:[--cell-size:2.15rem]" />
        </CardContent>
      </Card>

      <Card className="gap-0 border-0 bg-white py-0 shadow-sm ring-1 ring-slate-200">
        <CardHeader className="border-b border-slate-100 py-4">
          <CardTitle className="text-sm font-semibold">Selected day</CardTitle>
          <p className="text-xs text-muted-foreground">{format(date, "EEEE, MMMM d")}</p>
        </CardHeader>
        <CardContent className="space-y-3 py-4">
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-900">
            <CalendarDays className="size-4" aria-hidden="true" />
            <span><strong>{selectedDayAppointments.length}</strong> scheduled consultations</span>
          </div>
          {selectedDayAppointments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No appointments are scheduled for this day.</p>
          ) : (
            <div className="space-y-2">
              {selectedDayAppointments.slice(0, 4).map((item) => (
                <Button key={item.appointment.id} type="button" variant="outline" onClick={() => onSelectAppointment(item)} className="h-auto w-full justify-start gap-2 px-3 py-2 text-left">
                  <CalendarDays className="size-4 shrink-0 text-primary" />
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-semibold">{item.patient?.name ?? "Patient unavailable"}</span>
                    <span className="block text-[11px] text-muted-foreground">{formatAppointmentTime(item.appointment.startTime)} · {item.appointment.status.toLowerCase()}</span>
                  </span>
                </Button>
              ))}
              {selectedDayAppointments.length > 4 ? <p className="text-xs text-muted-foreground">+{selectedDayAppointments.length - 4} more in the schedule</p> : null}
            </div>
          )}
        </CardContent>
      </Card>
    </aside>
  );
}
