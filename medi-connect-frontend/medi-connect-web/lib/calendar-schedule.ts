import { addDays, format, startOfMonth, startOfWeek } from "date-fns";

import { appointmentsOverlap } from "@/lib/appointment-schedule";
import type { AppointmentRecord } from "@/types/appointment";
import type { CalendarBlock, CalendarView } from "@/types/calendar";

export const CALENDAR_START_HOUR = 8;
export const CALENDAR_END_HOUR = 22;
export const CALENDAR_HOUR_HEIGHT = 64;

export function calendarDateKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function getCalendarDays(date: Date, view: CalendarView) {
  if (view === "day") return [date];
  const start = startOfWeek(view === "month" ? startOfMonth(date) : date, {
    weekStartsOn: 1,
  });
  return Array.from({ length: view === "month" ? 42 : 7 }, (_, index) =>
    addDays(start, index),
  );
}

export function getCalendarPosition(time: string) {
  return ((timeToMinutes(time) - CALENDAR_START_HOUR * 60) / 60) * CALENDAR_HOUR_HEIGHT;
}

export function getAvailableTimes(
  date: string,
  appointments: AppointmentRecord[],
  blocks: CalendarBlock[],
) {
  const times: string[] = [];
  for (let minutes = 9 * 60; minutes < 21 * 60; minutes += 30) {
    const time = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
    const candidate = { date, time, durationMinutes: 30 };
    const booked = appointments.some(
      (appointment) =>
        appointment.status !== "cancelled" &&
        appointmentsOverlap(appointment, candidate),
    );
    const blocked = blocks.some(
      (block) =>
        block.date === date &&
        minutes < timeToMinutes(block.endTime) &&
        minutes + 30 > timeToMinutes(block.startTime),
    );
    if (!booked && !blocked) times.push(time);
  }
  return times;
}
