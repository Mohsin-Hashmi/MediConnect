import { addDays, format, startOfMonth, startOfWeek } from "date-fns";

import type { CalendarView } from "@/types/calendar";

export const CALENDAR_START_HOUR = 8;
export const CALENDAR_END_HOUR = 22;
export const CALENDAR_HOUR_HEIGHT = 64;

export function calendarDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function timeToMinutes(time: string): number {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function getCalendarDays(date: Date, view: CalendarView): Date[] {
  if (view === "day") return [date];

  const start = startOfWeek(view === "month" ? startOfMonth(date) : date, {
    weekStartsOn: 1,
  });
  return Array.from({ length: view === "month" ? 42 : 7 }, (_, index) =>
    addDays(start, index),
  );
}

export function getCalendarPosition(time: string): number {
  const minutesFromCalendarStart =
    timeToMinutes(time) - CALENDAR_START_HOUR * 60;
  return (minutesFromCalendarStart / 60) * CALENDAR_HOUR_HEIGHT;
}
