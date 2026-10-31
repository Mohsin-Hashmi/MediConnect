import type {
  ApiDoctorPatient,
  PatientFilters,
  PatientMetricsData,
} from "@/types/patient";
import { getPatientAge } from "@/lib/appointment-format";

function matchesAge(patient: ApiDoctorPatient, group: PatientFilters["ageGroup"]) {
  if (group === "all") return true;
  const age = getPatientAge(patient.patient.dateOfBirth);
  if (age === null) return false;
  if (group === "under-18") return age < 18;
  if (group === "18-39") return age <= 39;
  if (group === "40-59") return age <= 59;
  return age >= 60;
}

export function getFilteredPatients(
  patients: readonly ApiDoctorPatient[],
  filters: PatientFilters,
): ApiDoctorPatient[] {
  const query = filters.search.trim().toLowerCase();
  return patients
    .filter((patient) => {
      const values = [
        patient.patient.name,
        patient.patient.id,
        patient.patient.email ?? "",
        patient.appointmentSummary.latest.reason ?? "",
      ];
      return (
        (!query ||
          values.some((value) => value.toLowerCase().includes(query))) &&
        (filters.gender === "all" ||
          patient.patient.gender === filters.gender) &&
        matchesAge(patient, filters.ageGroup)
      );
    })
    .sort((a, b) =>
      filters.sort === "name"
        ? a.patient.name.localeCompare(b.patient.name)
        : b.appointmentSummary.latest.date.localeCompare(
            a.appointmentSummary.latest.date,
          ) || a.patient.name.localeCompare(b.patient.name),
    );
}

export function getPatientMetrics(
  patients: readonly ApiDoctorPatient[],
): PatientMetricsData {
  return {
    total: patients.length,
    appointments: patients.reduce(
      (total, patient) => total + patient.appointmentSummary.total,
      0,
    ),
    upcoming: patients.reduce(
      (total, patient) => total + patient.appointmentSummary.upcoming,
      0,
    ),
    completed: patients.reduce(
      (total, patient) => total + patient.appointmentSummary.completed,
      0,
    ),
  };
}
