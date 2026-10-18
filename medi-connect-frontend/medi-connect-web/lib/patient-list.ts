import type {
  PatientFilters,
  PatientMetricsData,
  PatientRecord,
} from "@/types/patient";

function matchesAgeGroup(
  patient: PatientRecord,
  ageGroup: PatientFilters["ageGroup"],
): boolean {
  if (ageGroup === "all") return true;
  if (ageGroup === "under-18") return patient.age < 18;
  if (ageGroup === "18-39") return patient.age >= 18 && patient.age <= 39;
  if (ageGroup === "40-59") return patient.age >= 40 && patient.age <= 59;
  return patient.age >= 60;
}

function matchesPatientSearch(patient: PatientRecord, query: string): boolean {
  if (!query) return true;

  return [patient.name, patient.id, patient.email, patient.careFocus].some(
    (value) => value.toLowerCase().includes(query),
  );
}

function matchesPatientFilters(
  patient: PatientRecord,
  filters: PatientFilters,
  query: string,
): boolean {
  return (
    matchesPatientSearch(patient, query) &&
    (filters.gender === "all" || patient.gender === filters.gender) &&
    (filters.status === "all" || patient.status === filters.status) &&
    matchesAgeGroup(patient, filters.ageGroup)
  );
}

export function getPatientMetrics(
  patients: readonly PatientRecord[],
  referenceDate: string,
): PatientMetricsData {
  const recentStart = new Date(`${referenceDate}T12:00:00`);
  recentStart.setDate(recentStart.getDate() - 30);
  const start = recentStart.toISOString().slice(0, 10);
  return {
    total: patients.length,
    active: patients.filter((patient) => patient.status === "active").length,
    inactive: patients.filter((patient) => patient.status === "inactive")
      .length,
    recentlyRegistered: patients.filter(
      (patient) =>
        patient.registeredAt >= start && patient.registeredAt <= referenceDate,
    ).length,
  };
}

export function getFilteredPatients(
  patients: readonly PatientRecord[],
  filters: PatientFilters,
): PatientRecord[] {
  const query = filters.search.trim().toLowerCase();

  return patients
    .filter((patient) => matchesPatientFilters(patient, filters, query))
    .sort((a, b) => {
      if (filters.sort === "name") return a.name.localeCompare(b.name);
      return (
        b.registeredAt.localeCompare(a.registeredAt) ||
        a.name.localeCompare(b.name)
      );
    });
}
