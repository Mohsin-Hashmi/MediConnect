import { APPOINTMENTS_DEMO_DATE } from "@/data/mock/appointments";
import type {
  AppointmentFilters,
  AppointmentRecord,
  AppointmentSortOrder,
  AppointmentTab,
} from "@/types/appointment";

export function matchesAppointmentTab(appointment: AppointmentRecord, tab: AppointmentTab) {
  switch (tab) {
    case "upcoming":
      return appointment.date >= APPOINTMENTS_DEMO_DATE &&
        (appointment.status === "confirmed" || appointment.status === "pending");
    case "today":
      return appointment.date === APPOINTMENTS_DEMO_DATE;
    case "completed":
      return appointment.status === "completed";
    case "cancelled":
      return appointment.status === "cancelled";
    default:
      return true;
  }
}

export function getAppointmentTabCounts(appointments: readonly AppointmentRecord[]): Record<AppointmentTab, number> {
  return {
    all: appointments.length,
    upcoming: appointments.filter((item) => matchesAppointmentTab(item, "upcoming")).length,
    today: appointments.filter((item) => matchesAppointmentTab(item, "today")).length,
    completed: appointments.filter((item) => matchesAppointmentTab(item, "completed")).length,
    cancelled: appointments.filter((item) => matchesAppointmentTab(item, "cancelled")).length,
  };
}

export function compareAppointments(a: AppointmentRecord, b: AppointmentRecord, sort: AppointmentSortOrder) {
  const aDateTime = `${a.date}T${a.time}`;
  const bDateTime = `${b.date}T${b.time}`;

  if (sort === "oldest") return aDateTime.localeCompare(bDateTime);
  if (sort === "newest") return bDateTime.localeCompare(aDateTime);

  const group = (date: string) => date === APPOINTMENTS_DEMO_DATE ? 0 : date > APPOINTMENTS_DEMO_DATE ? 1 : 2;
  const groupDifference = group(a.date) - group(b.date);
  if (groupDifference !== 0) return groupDifference;
  return group(a.date) === 2 ? bDateTime.localeCompare(aDateTime) : aDateTime.localeCompare(bDateTime);
}

export function getFilteredAppointments(appointments: readonly AppointmentRecord[], filters: AppointmentFilters) {
  const query = filters.search.trim().toLowerCase();

  return appointments
    .filter((item) => matchesAppointmentTab(item, filters.tab))
    .filter((item) => !query || [item.patientName, item.patientId, item.id, item.reason]
      .some((value) => value.toLowerCase().includes(query)))
    .filter((item) => !filters.date || item.date === filters.date)
    .filter((item) => filters.visitType === "all" || item.visitType === filters.visitType)
    .filter((item) => filters.status === "all" || item.status === filters.status)
    .sort((a, b) => compareAppointments(a, b, filters.sort));
}
