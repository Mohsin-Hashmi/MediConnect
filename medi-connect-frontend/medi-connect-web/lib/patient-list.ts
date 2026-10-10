import type { PatientFilters, PatientMetricsData, PatientRecord } from "@/types/patient";

export function getPatientMetrics(patients: PatientRecord[], referenceDate: string): PatientMetricsData {
  const dueEnd = new Date(`${referenceDate}T12:00:00`);
  dueEnd.setDate(dueEnd.getDate() + 7);
  const recentStart = new Date(`${referenceDate}T12:00:00`);
  recentStart.setDate(recentStart.getDate() - 30);
  const end = dueEnd.toISOString().slice(0, 10);
  const start = recentStart.toISOString().slice(0, 10);
  return {
    total: patients.length,
    active: patients.filter((patient) => patient.status === "active").length,
    upcoming: patients.filter((patient) => patient.nextAppointmentDate && patient.nextAppointmentDate >= referenceDate && patient.nextAppointmentDate <= end).length,
    recentlyRegistered: patients.filter((patient) => patient.registeredAt >= start && patient.registeredAt <= referenceDate).length,
  };
}

export function getFilteredPatients(patients: PatientRecord[], filters: PatientFilters): PatientRecord[] {
  const query = filters.search.trim().toLowerCase();
  return patients.filter((patient) => {
    const ageMatches = filters.ageGroup === "all" ||
      (filters.ageGroup === "under-18" && patient.age < 18) ||
      (filters.ageGroup === "18-39" && patient.age >= 18 && patient.age <= 39) ||
      (filters.ageGroup === "40-59" && patient.age >= 40 && patient.age <= 59) ||
      (filters.ageGroup === "60-plus" && patient.age >= 60);
    return (!query || [patient.name, patient.id, patient.email, patient.careFocus].some((value) => value.toLowerCase().includes(query))) &&
      (filters.gender === "all" || patient.gender === filters.gender) &&
      (filters.status === "all" || patient.status === filters.status) && ageMatches;
  }).sort((a, b) => {
    if (filters.sort === "name") return a.name.localeCompare(b.name);
    if (filters.sort === "next") return (a.nextAppointmentDate ?? "9999").localeCompare(b.nextAppointmentDate ?? "9999") || a.name.localeCompare(b.name);
    return (b.lastVisitDate ?? "").localeCompare(a.lastVisitDate ?? "") || a.name.localeCompare(b.name);
  });
}
