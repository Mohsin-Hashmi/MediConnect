import { addDays, format, startOfWeek } from "date-fns";

import type { AppointmentRecord } from "@/types/appointment";
import type {
  DashboardMetricsData,
  WeeklyAppointmentActivity,
} from "@/types/doctor-dashboard";

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

export function getWeeklyAppointmentActivity(
  appointments: readonly AppointmentRecord[],
  now = new Date(),
): WeeklyAppointmentActivity[] {
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });

  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStart, index);
    const dateKey = format(date, "yyyy-MM-dd");
    const dayAppointments = appointments.filter(
      (appointment) => appointment.date === dateKey,
    );

    return {
      day: format(date, "EEE"),
      date: dateKey,
      completed: dayAppointments.filter(
        (appointment) => appointment.status === "completed",
      ).length,
      confirmed: dayAppointments.filter(
        (appointment) => appointment.status === "confirmed",
      ).length,
      cancelled: dayAppointments.filter(
        (appointment) => appointment.status === "cancelled",
      ).length,
    };
  });
}
