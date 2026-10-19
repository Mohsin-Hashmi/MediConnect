import { addDays, format, startOfWeek } from "date-fns";

import type { AppointmentRecord } from "@/types/appointment";
import type {
  AppointmentWeekdayActivity,
  DashboardMetricsData,
} from "@/types/doctor-dashboard";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

function appointmentDateTime(appointment: AppointmentRecord): Date {
  return new Date(`${appointment.date}T${appointment.time}:00`);
}

function isOpenAppointment(appointment: AppointmentRecord): boolean {
  return appointment.status === "pending" || appointment.status === "confirmed";
}

function isTerminalAppointment(appointment: AppointmentRecord): boolean {
  return appointment.status === "completed" || appointment.status === "cancelled";
}

export function getNextAppointment(
  appointments: readonly AppointmentRecord[],
  now = new Date(),
): AppointmentRecord | null {
  return (
    appointments
      .filter(
        (appointment) =>
          isOpenAppointment(appointment) &&
          appointmentDateTime(appointment) >= now,
      )
      .sort(
        (first, second) =>
          appointmentDateTime(first).getTime() -
          appointmentDateTime(second).getTime(),
      )[0] ?? null
  );
}

export function getDashboardMetrics(
  appointments: readonly AppointmentRecord[],
  now = new Date(),
): DashboardMetricsData {
  const today = format(now, "yyyy-MM-dd");
  const start = startOfWeek(now, { weekStartsOn: 1 });
  const weekStart = format(start, "yyyy-MM-dd");
  const weekEnd = format(addDays(start, 6), "yyyy-MM-dd");
  const weeklyTerminalAppointments = appointments.filter(
    (appointment) =>
      appointment.date >= weekStart &&
      appointment.date <= weekEnd &&
      isTerminalAppointment(appointment),
  );
  const completed = weeklyTerminalAppointments.filter(
    (appointment) => appointment.status === "completed",
  ).length;

  return {
    todayAppointments: appointments.filter(
      (appointment) => appointment.date === today,
    ).length,
    upcomingAppointments: appointments.filter(
      (appointment) =>
        isOpenAppointment(appointment) &&
        appointmentDateTime(appointment) >= now,
    ).length,
    patientsWithAppointments: new Set(
      appointments.map((appointment) => appointment.patientId),
    ).size,
    completionRate:
      weeklyTerminalAppointments.length === 0
        ? 0
        : (completed / weeklyTerminalAppointments.length) * 100,
  };
}

function getWeekdayIndex(date: string): number | null {
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return null;

  const appointmentDate = new Date(year, month - 1, day);
  if (Number.isNaN(appointmentDate.getTime())) return null;

  return (appointmentDate.getDay() + 6) % 7;
}

/** Groups all loaded appointment records by weekday and terminal status. */
export function getAppointmentActivityByWeekday(
  appointments: readonly AppointmentRecord[],
): AppointmentWeekdayActivity[] {
  const activity = WEEKDAYS.map((day) => ({
    day,
    completed: 0,
    confirmed: 0,
    cancelled: 0,
  }));

  appointments.forEach((appointment) => {
    const weekdayIndex = getWeekdayIndex(appointment.date);
    if (weekdayIndex === null) return;

    const dayActivity = activity[weekdayIndex];
    if (appointment.status === "completed") dayActivity.completed += 1;
    if (appointment.status === "confirmed") dayActivity.confirmed += 1;
    if (appointment.status === "cancelled") dayActivity.cancelled += 1;
  });

  return activity;
}
