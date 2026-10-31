export function formatAppointmentDate(date: string) {
  const value = date.includes("T") ? new Date(date) : new Date(`${date}T12:00:00Z`);
  return new Intl.DateTimeFormat("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(value);
}

export function formatAppointmentTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  return `${String(hours % 12 || 12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
}

export function getAppointmentDateKey(date: string): string {
  return date.slice(0, 10);
}

export function getAppointmentDurationMinutes(
  startTime: string,
  endTime: string,
): number {
  const [startHours = 0, startMinutes = 0] = startTime.split(":").map(Number);
  const [endHours = 0, endMinutes = 0] = endTime.split(":").map(Number);
  return Math.max(
    0,
    endHours * 60 + endMinutes - (startHours * 60 + startMinutes),
  );
}

export function getPatientAge(dateOfBirth?: string | null): number | null {
  if (!dateOfBirth) return null;

  const birthDate = new Date(dateOfBirth);
  if (Number.isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const birthdayHasNotOccurred =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate());

  if (birthdayHasNotOccurred) age -= 1;
  return age >= 0 ? age : null;
}
