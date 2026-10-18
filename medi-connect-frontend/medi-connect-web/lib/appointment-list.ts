import type {
  AppointmentFilters,
  AppointmentRecord,
  AppointmentSortOrder,
} from "@/types/appointment";

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
  first: AppointmentRecord,
  second: AppointmentRecord,
  sort: AppointmentSortOrder,
  today: string,
): number {
  const firstDateTime = `${first.date}T${first.time}`;
  const secondDateTime = `${second.date}T${second.time}`;

  if (sort === "oldest") return firstDateTime.localeCompare(secondDateTime);
  if (sort === "newest") return secondDateTime.localeCompare(firstDateTime);

  const firstGroup = getScheduleGroup(first.date, today);
  const secondGroup = getScheduleGroup(second.date, today);
  const groupDifference = firstGroup - secondGroup;
  if (groupDifference !== 0) return groupDifference;

  return firstGroup === 2
    ? secondDateTime.localeCompare(firstDateTime)
    : firstDateTime.localeCompare(secondDateTime);
}

function matchesSearch(
  appointment: AppointmentRecord,
  query: string,
): boolean {
  if (!query) return true;

  return [
    appointment.patientName,
    appointment.patientId,
    appointment.id,
    appointment.reason,
  ].some((value) => value.toLowerCase().includes(query));
}

function matchesFilters(
  appointment: AppointmentRecord,
  filters: AppointmentFilters,
  query: string,
): boolean {
  return (
    matchesSearch(appointment, query) &&
    (!filters.date || appointment.date === filters.date) &&
    (filters.status === "all" || appointment.status === filters.status)
  );
}

/** Filters and orders appointments without mutating the API-backed list. */
export function getFilteredAppointments(
  appointments: readonly AppointmentRecord[],
  filters: AppointmentFilters,
  referenceDate = new Date(),
): AppointmentRecord[] {
  const query = filters.search.trim().toLowerCase();
  const today = getLocalDateKey(referenceDate);

  return appointments
    .filter((appointment) => matchesFilters(appointment, filters, query))
    .sort((first, second) =>
      compareAppointments(first, second, filters.sort, today),
    );
}
