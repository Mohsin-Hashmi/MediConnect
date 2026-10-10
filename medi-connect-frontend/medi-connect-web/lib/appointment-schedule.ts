import type { AppointmentRecord, NewAppointmentInput } from "@/types/appointment";
import type { CalendarBlock } from "@/types/calendar";

function minutesFromTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function appointmentsOverlap(
  first: Pick<AppointmentRecord, "date" | "time" | "durationMinutes">,
  second: Pick<AppointmentRecord, "date" | "time" | "durationMinutes">,
) {
  if (first.date !== second.date) return false;
  const firstStart = minutesFromTime(first.time);
  const secondStart = minutesFromTime(second.time);
  return firstStart < secondStart + second.durationMinutes &&
    secondStart < firstStart + first.durationMinutes;
}

export function hasBookingConflict(
  appointments: AppointmentRecord[],
  candidate: NewAppointmentInput,
) {
  return appointments.some(
    (appointment) =>
      appointment.status !== "cancelled" &&
      appointmentsOverlap(appointment, candidate),
  );
}

export function hasBlockedTimeConflict(blocks: CalendarBlock[], candidate: NewAppointmentInput) {
  const start = minutesFromTime(candidate.time);
  return blocks.some(
    (block) =>
      block.date === candidate.date &&
      start < minutesFromTime(block.endTime) &&
      start + candidate.durationMinutes > minutesFromTime(block.startTime),
  );
}
