import { addDays, format, startOfWeek } from "date-fns";

import type { DoctorAppointmentApiItem } from "@/types/appointment";
import type {
  AppointmentWeekdayActivity,
  DashboardMetricsData,
} from "@/types/doctor-dashboard";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

function appointmentDateTime(item: DoctorAppointmentApiItem): Date {
  return new Date(
    `${item.appointment.date.slice(0, 10)}T${item.appointment.startTime}:00`,
  );
}

function isOpenAppointment(item: DoctorAppointmentApiItem): boolean {
  return (
    item.appointment.status === "PENDING" ||
    item.appointment.status === "CONFIRMED"
  );
}

function isTerminalAppointment(item: DoctorAppointmentApiItem): boolean {
  return (
    item.appointment.status === "COMPLETED" ||
    item.appointment.status === "CANCELLED"
  );
}

export function getNextAppointment(
  appointments: readonly DoctorAppointmentApiItem[],
  now = new Date(),
): DoctorAppointmentApiItem | null {
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
  appointments: readonly DoctorAppointmentApiItem[],
  now = new Date(),
): DashboardMetricsData {
  const today = format(now, "yyyy-MM-dd");
  const start = startOfWeek(now, { weekStartsOn: 1 });
  const weekStart = format(start, "yyyy-MM-dd");
  const weekEnd = format(addDays(start, 6), "yyyy-MM-dd");
  const weeklyTerminalAppointments = appointments.filter(
    (appointment) =>
      appointment.appointment.date.slice(0, 10) >= weekStart &&
      appointment.appointment.date.slice(0, 10) <= weekEnd &&
      isTerminalAppointment(appointment),
  );
  const completed = weeklyTerminalAppointments.filter(
    (appointment) => appointment.appointment.status === "COMPLETED",
  ).length;

  return {
    todayAppointments: appointments.filter(
      (appointment) => appointment.appointment.date.slice(0, 10) === today,
    ).length,
    upcomingAppointments: appointments.filter(
      (appointment) =>
        isOpenAppointment(appointment) &&
        appointmentDateTime(appointment) >= now,
    ).length,
    patientsWithAppointments: new Set(
      appointments.map((appointment) => appointment.appointment.patientId),
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
  appointments: readonly DoctorAppointmentApiItem[],
): AppointmentWeekdayActivity[] {
  const activity = WEEKDAYS.map((day) => ({
    day,
    completed: 0,
    confirmed: 0,
    cancelled: 0,
  }));

  appointments.forEach((appointment) => {
    const weekdayIndex = getWeekdayIndex(appointment.appointment.date.slice(0, 10));
    if (weekdayIndex === null) return;

    const dayActivity = activity[weekdayIndex];
    if (appointment.appointment.status === "COMPLETED") dayActivity.completed += 1;
    if (appointment.appointment.status === "CONFIRMED") dayActivity.confirmed += 1;
    if (appointment.appointment.status === "CANCELLED") dayActivity.cancelled += 1;
  });

  return activity;
}
