"use client";

import { format, isSameDay } from "date-fns";
import { LockKeyhole, Plus } from "lucide-react";

import { CalendarEventCard } from "@/components/dashboard/calendar/views/calendar-event-card";
import { Button } from "@/components/ui/button";
import {
  CALENDAR_END_HOUR,
  CALENDAR_HOUR_HEIGHT,
  CALENDAR_START_HOUR,
  calendarDateKey,
  getCalendarPosition,
  timeToMinutes,
} from "@/lib/calendar-schedule";
import type { CalendarTimeGridProps } from "@/types/calendar";

const hours = Array.from(
  { length: CALENDAR_END_HOUR - CALENDAR_START_HOUR },
  (_, index) => CALENDAR_START_HOUR + index,
);

export function CalendarTimeGrid({
  days,
  appointments,
  blocks,
  selectedDate,
  onSelectDate,
  onSelectAppointment,
  onSelectSlot,
}: CalendarTimeGridProps) {
  const gridColumns = `64px repeat(${days.length}, minmax(${days.length === 1 ? 280 : 142}px, 1fr))`;
  return (
    <div className="overflow-x-auto">
      <div className="min-w-fit">
        <div className="sticky top-0 z-10 grid border-b border-slate-200 bg-white" style={{ gridTemplateColumns: gridColumns }}>
          <div className="border-r border-slate-200" />
          {days.map((day) => (
            <Button
              key={calendarDateKey(day)}
              type="button"
              variant="ghost"
              onClick={() => onSelectDate(day)}
              aria-pressed={isSameDay(day, selectedDate)}
              className="group h-16 flex-col gap-0.5 rounded-none border-r border-slate-100 text-sm hover:bg-blue-50 aria-pressed:bg-blue-50"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{format(day, "EEE")}</span>
              <span className="flex size-7 items-center justify-center rounded-full font-semibold group-aria-pressed:bg-primary group-aria-pressed:text-white">{format(day, "d")}</span>
            </Button>
          ))}
        </div>
        <div className="grid" style={{ gridTemplateColumns: gridColumns }}>
          <div className="border-r border-slate-200 bg-slate-50/50">
            {hours.map((hour) => (
              <div key={hour} className="h-16 border-b border-slate-100 pr-2 pt-1 text-right text-[11px] text-muted-foreground">
                {format(new Date(2026, 0, 1, hour), "hh:mm a")}
              </div>
            ))}
          </div>
          {days.map((day) => {
            const date = calendarDateKey(day);
            const dayAppointments = appointments.filter((item) => item.date === date);
            const dayBlocks = blocks.filter((block) => block.date === date);
            return (
              <div key={date} className="relative border-r border-slate-100 bg-white">
                {hours.map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    aria-label={`Schedule appointment on ${format(day, "EEEE, MMMM d")} at ${format(new Date(2026, 0, 1, hour), "h a")}`}
                    onClick={() => onSelectSlot(date, `${String(hour).padStart(2, "0")}:00`)}
                    className="group flex h-16 w-full items-start justify-end border-b border-slate-100 p-1 text-primary hover:bg-blue-50/50 focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    <Plus className="size-3.5 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true" />
                  </button>
                ))}
                {dayBlocks.map((block) => {
                  const height = ((timeToMinutes(block.endTime) - timeToMinutes(block.startTime)) / 60) * CALENDAR_HOUR_HEIGHT;
                  return (
                    <div
                      key={block.id}
                      title={block.title}
                      style={{ top: getCalendarPosition(block.startTime), height }}
                      className="pointer-events-none absolute inset-x-1 z-10 flex items-start gap-1 overflow-hidden rounded-md border border-indigo-200 bg-indigo-50/95 px-1.5 py-1 text-[11px] font-medium text-indigo-800"
                    >
                      <LockKeyhole className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                      <span className="line-clamp-2">{block.title}</span>
                    </div>
                  );
                })}
                {dayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    style={{
                      top: getCalendarPosition(appointment.time),
                      height: Math.max(36, (appointment.durationMinutes / 60) * CALENDAR_HOUR_HEIGHT),
                    }}
                    className="absolute inset-x-1 z-20"
                  >
                    <CalendarEventCard appointment={appointment} onClick={() => onSelectAppointment(appointment)} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
