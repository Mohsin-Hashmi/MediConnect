import type {
  DoctorAppointmentApiItem,
  AppointmentFilters,
  AppointmentSortOrder,
} from "@/types/appointment";
import { getAppointmentDateKey } from "@/lib/appointment-format";

function getLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getScheduleGroup(date: string, today: string): number {
  if (date === today) return 0;
  return date > today ? 1 : 2;
}

function compareAppointments(
  first: DoctorAppointmentApiItem,
  second: DoctorAppointmentApiItem,
  sort: AppointmentSortOrder,
  today: string,
): number {
  const firstDate = getAppointmentDateKey(first.appointment.date);
  const secondDate = getAppointmentDateKey(second.appointment.date);
  const firstDateTime = `${firstDate}T${first.appointment.startTime}`;
  const secondDateTime = `${secondDate}T${second.appointment.startTime}`;

  if (sort === "oldest") return firstDateTime.localeCompare(secondDateTime);
  if (sort === "newest") return secondDateTime.localeCompare(firstDateTime);

  const firstGroup = getScheduleGroup(firstDate, today);
  const secondGroup = getScheduleGroup(secondDate, today);
  const groupDifference = firstGroup - secondGroup;
  if (groupDifference !== 0) return groupDifference;

  return firstGroup === 2
    ? secondDateTime.localeCompare(firstDateTime)
    : firstDateTime.localeCompare(secondDateTime);
}

function matchesSearch(
  item: DoctorAppointmentApiItem,
  query: string,
): boolean {
  if (!query) return true;

  return [
    item.patient?.name ?? "",
    item.appointment.patientId,
    item.appointment.id,
    item.appointment.reason ?? "",
  ].some((value) => value.toLowerCase().includes(query));
}

function matchesFilters(
  item: DoctorAppointmentApiItem,
  filters: AppointmentFilters,
  query: string,
): boolean {
  return (
    matchesSearch(item, query) &&
    (!filters.date ||
      getAppointmentDateKey(item.appointment.date) === filters.date) &&
    (filters.status === "all" || item.appointment.status === filters.status)
  );
}

/** Filters and orders appointments without mutating the API-backed list. */
export function getFilteredAppointments(
  appointments: readonly DoctorAppointmentApiItem[],
  filters: AppointmentFilters,
  referenceDate = new Date(),
): DoctorAppointmentApiItem[] {
  const query = filters.search.trim().toLowerCase();
  const today = getLocalDateKey(referenceDate);

  return appointments
    .filter((appointment) => matchesFilters(appointment, filters, query))
    .sort((first, second) =>
      compareAppointments(first, second, filters.sort, today),
    );
}
