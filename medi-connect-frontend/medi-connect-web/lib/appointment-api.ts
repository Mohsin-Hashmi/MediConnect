import type {
  DoctorAppointmentApiItem,
  AppointmentRecord,
} from "@/types/appointment";

const AVATAR_TONES: readonly AppointmentRecord["avatarTone"][] = [
  "blue",
  "teal",
  "amber",
  "violet",
];

function timeToMinutes(time: string): number {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function calculateAge(dateOfBirth?: string | null): number | null {
  if (!dateOfBirth) return null;

  const birthDate = new Date(dateOfBirth);
  if (Number.isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getUTCFullYear() - birthDate.getUTCFullYear();
  const hasNotHadBirthday =
    today.getUTCMonth() < birthDate.getUTCMonth() ||
    (today.getUTCMonth() === birthDate.getUTCMonth() &&
      today.getUTCDate() < birthDate.getUTCDate());

  if (hasNotHadBirthday) age -= 1;
  return age >= 0 ? age : null;
}

function getAvatarTone(id: string): AppointmentRecord["avatarTone"] {
  const value = [...id].reduce((total, character) => {
    return total + character.charCodeAt(0);
  }, 0);

  return AVATAR_TONES[value % AVATAR_TONES.length];
}

/**
 * Converts the doctor appointment API response into the view model shared by
 * the appointments, calendar, and dashboard screens.
 */
export function mapDoctorAppointmentFromApi(
  item: DoctorAppointmentApiItem,
): AppointmentRecord {
  const { appointment, patient } = item;

  return {
    id: appointment.id,
    patientId: appointment.patientId,
    patientName: patient?.name ?? "Patient unavailable",
    patientAge: calculateAge(patient?.dateOfBirth),
    patientEmail: patient?.email ?? null,
    patientPhone: patient?.phone ?? null,
    patientProfileImage: patient?.profileImage ?? null,
    reason: appointment.reason?.trim() || "No reason provided",
    notes: appointment.notes?.trim() || null,
    date: appointment.date.slice(0, 10),
    time: appointment.startTime,
    endTime: appointment.endTime,
    durationMinutes: Math.max(
      0,
      timeToMinutes(appointment.endTime) - timeToMinutes(appointment.startTime),
    ),
    visitType: null,
    status: appointment.status.toLowerCase() as AppointmentRecord["status"],
    feePkr: null,
    cancellationReason: appointment.cancellationReason?.trim() || null,
    avatarTone: getAvatarTone(appointment.patientId),
  };
}
