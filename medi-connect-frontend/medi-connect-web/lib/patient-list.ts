import type {
  ApiDoctorPatient,
  PatientFilters,
  PatientMetricsData,
  PatientRecord,
} from "@/types/patient";

function normalizeGender(value: string | null): string | null {
  if (!value) return null;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function calculateAge(dateOfBirth?: string | null): number | null {
  if (!dateOfBirth) return null;
  const birthDate = new Date(dateOfBirth);
  if (Number.isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate())
  )
    age -= 1;
  return age >= 0 ? age : null;
}

export function mapDoctorPatientFromApi(item: ApiDoctorPatient): PatientRecord {
  return {
    id: item.patient.id,
    name: item.patient.name,
    age: calculateAge(item.patient.dateOfBirth),
    gender: normalizeGender(item.patient.gender ?? null),
    email: item.patient.email,
    phone: item.patient.phone ?? null,
    profileImage: item.patient.profileImage ?? null,
    latestReason:
      item.appointmentSummary.latest.reason?.trim() || "No reason provided",
    latestAppointmentDate: item.appointmentSummary.latest.date,
    latestAppointmentStatus:
      item.appointmentSummary.latest.status.toLowerCase() as PatientRecord["latestAppointmentStatus"],
    appointmentCount: item.appointmentSummary.total,
    upcomingAppointmentCount: item.appointmentSummary.upcoming,
    completedAppointmentCount: item.appointmentSummary.completed,
  };
}

function matchesAge(patient: PatientRecord, group: PatientFilters["ageGroup"]) {
  if (group === "all") return true;
  if (patient.age === null) return false;
  if (group === "under-18") return patient.age < 18;
  if (group === "18-39") return patient.age <= 39;
  if (group === "40-59") return patient.age <= 59;
  return patient.age >= 60;
}

export function getFilteredPatients(
  patients: readonly PatientRecord[],
  filters: PatientFilters,
): PatientRecord[] {
  const query = filters.search.trim().toLowerCase();
  return patients
    .filter((patient) => {
      const values = [
        patient.name,
        patient.id,
        patient.email ?? "",
        patient.latestReason,
      ];
      return (
        (!query ||
          values.some((value) => value.toLowerCase().includes(query))) &&
        (filters.gender === "all" || patient.gender === filters.gender) &&
        matchesAge(patient, filters.ageGroup)
      );
    })
    .sort((a, b) =>
      filters.sort === "name"
        ? a.name.localeCompare(b.name)
        : b.latestAppointmentDate.localeCompare(a.latestAppointmentDate) ||
          a.name.localeCompare(b.name),
    );
}

export function getPatientMetrics(
  patients: readonly PatientRecord[],
): PatientMetricsData {
  return {
    total: patients.length,
    appointments: patients.reduce(
      (total, patient) => total + patient.appointmentCount,
      0,
    ),
    upcoming: patients.reduce(
      (total, patient) => total + patient.upcomingAppointmentCount,
      0,
    ),
    completed: patients.reduce(
      (total, patient) => total + patient.completedAppointmentCount,
      0,
    ),
  };
}
