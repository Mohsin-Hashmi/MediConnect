"use client";

import { format, isSameMonth, isToday } from "date-fns";
import { LockKeyhole } from "lucide-react";

import { CalendarEventCard } from "@/components/dashboard/calendar/views/calendar-event-card";
import { Button } from "@/components/ui/button";
import { calendarDateKey, getCalendarDays } from "@/lib/calendar-schedule";
import { cn } from "@/lib/utils";
import type { CalendarMonthGridProps } from "@/types/calendar";

const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarMonthGrid({
  date,
  appointments,
  blocks,
  onSelectDate,
  onSelectAppointment,
}: CalendarMonthGridProps) {
  const days = getCalendarDays(date, "month");
  return (
    <div className="overflow-x-auto">
      <div className="min-w-180">
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/70">
          {weekdayLabels.map((label) => (
            <div
              key={label}
              className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              {label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day) => {
            const dayKey = calendarDateKey(day);
            const dayAppointments = appointments.filter(
              (item) => item.date === dayKey,
            );
            const dayBlocks = blocks.filter((block) => block.date === dayKey);
            return (
              <div
                key={dayKey}
                className={cn(
                  "min-h-32 border-b border-r border-slate-100 p-2",
                  !isSameMonth(day, date) && "bg-slate-50/60",
                )}
              >
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onSelectDate(day)}
                  aria-label={`Open schedule for ${format(day, "MMMM d, yyyy")}`}
                  className={cn(
                    "mb-1 size-7 rounded-full p-0 text-xs font-semibold",
                    isToday(day) &&
                      "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                    !isSameMonth(day, date) && "text-muted-foreground",
                  )}
                >
                  {format(day, "d")}
                </Button>
                <div className="space-y-1">
                  {dayAppointments.slice(0, 2).map((appointment) => (
                    <CalendarEventCard
                      key={appointment.id}
                      appointment={appointment}
                      onClick={() => onSelectAppointment(appointment)}
                      compact
                    />
                  ))}
                  {dayBlocks
                    .slice(0, dayAppointments.length < 2 ? 1 : 0)
                    .map((block) => (
                      <div
                        key={block.id}
                        className="flex items-center gap-1 truncate rounded bg-indigo-50 px-1.5 py-1 text-[11px] text-indigo-800"
                      >
                        <LockKeyhole className="size-3 shrink-0" />
                        {block.title}
                      </div>
                    ))}
                  {dayAppointments.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => onSelectDate(day)}
                      className="h-6 px-1 text-[11px] text-primary"
                    >
                      +{dayAppointments.length - 2} more
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
