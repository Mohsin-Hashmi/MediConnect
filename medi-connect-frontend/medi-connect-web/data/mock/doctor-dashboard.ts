import type { DoctorDashboardMockData } from "@/types/doctor-dashboard";

export const doctorDashboardMock: DoctorDashboardMockData = {
  doctor: {
    firstName: "Sarah",
    specialty: "Cardiologist",
  },
  appointments: [
    { id: "apt-001", patientName: "Sarah Ahmed", initials: "SA", reason: "Cardiology follow-up", time: "09:30 AM", visitType: "Video", status: "confirmed", avatarTone: "blue" },
    { id: "apt-002", patientName: "Ahmed Khan", initials: "AK", reason: "Hypertension check", time: "11:00 AM", visitType: "In-person", status: "confirmed", avatarTone: "teal" },
    { id: "apt-003", patientName: "Maria James", initials: "MJ", reason: "ECG review", time: "02:30 PM", visitType: "Video", status: "pending", avatarTone: "amber" },
    { id: "apt-004", patientName: "Tariq Mahmood", initials: "TM", reason: "Post-angioplasty", time: "04:15 PM", visitType: "In-person", status: "confirmed", avatarTone: "blue" },
    { id: "apt-005", patientName: "Zainab Malik", initials: "ZM", reason: "Routine check-up", time: "05:00 PM", visitType: "Video", status: "completed", avatarTone: "violet" },
    { id: "apt-006", patientName: "Bilal Hussain", initials: "BH", reason: "Blood pressure review", time: "05:30 PM", visitType: "In-person", status: "confirmed", avatarTone: "teal" },
    { id: "apt-007", patientName: "Ayesha Noor", initials: "AN", reason: "Cardiac consultation", time: "06:00 PM", visitType: "Video", status: "pending", avatarTone: "violet" },
    { id: "apt-008", patientName: "Farhan Ali", initials: "FA", reason: "Follow-up visit", time: "06:30 PM", visitType: "In-person", status: "confirmed", avatarTone: "amber" },
    { id: "apt-009", patientName: "Hina Raza", initials: "HR", reason: "Test results", time: "07:00 PM", visitType: "Video", status: "confirmed", avatarTone: "blue" },
    { id: "apt-010", patientName: "Omar Siddiq", initials: "OS", reason: "Medication review", time: "07:30 PM", visitType: "In-person", status: "pending", avatarTone: "teal" },
    { id: "apt-011", patientName: "Nadia Sheikh", initials: "NS", reason: "Cardiology follow-up", time: "08:00 PM", visitType: "Video", status: "confirmed", avatarTone: "violet" },
    { id: "apt-012", patientName: "Usman Iqbal", initials: "UI", reason: "Preventive screening", time: "08:30 PM", visitType: "In-person", status: "confirmed", avatarTone: "amber" },
  ],
  upcomingAppointmentsCount: 48,
  totalPatients: 1280,
  weeklyActivity: [
    { day: "Mon", completed: 9, confirmed: 7, cancelled: 1 },
    { day: "Tue", completed: 11, confirmed: 8, cancelled: 0 },
    { day: "Wed", completed: 10, confirmed: 7, cancelled: 1 },
    { day: "Thu", completed: 12, confirmed: 6, cancelled: 1 },
    { day: "Fri", completed: 8, confirmed: 5, cancelled: 0 },
    { day: "Sat", completed: 10, confirmed: 4, cancelled: 1 },
    { day: "Sun", completed: 5, confirmed: 2, cancelled: 0 },
  ],
  nextAppointmentId: "apt-002",
  patientCohort: {
    newPatientsPercent: 32,
    returningPatientsPercent: 68,
  },
  availability: [
    { day: "Mon", hours: "09:00 AM – 01:00 PM", mode: "In-clinic" },
    { day: "Tue", hours: "02:00 PM – 06:00 PM", mode: "Telehealth" },
    { day: "Wed", hours: "09:00 AM – 01:00 PM", mode: "Hybrid" },
  ],
};

export function getMockDashboardMetrics(data: DoctorDashboardMockData) {
  const completed = data.weeklyActivity.reduce(
    (sum, day) => sum + day.completed,
    0,
  );
  const cancelled = data.weeklyActivity.reduce(
    (sum, day) => sum + day.cancelled,
    0,
  );

  return {
    todayAppointments: data.appointments.length,
    upcomingAppointments: data.upcomingAppointmentsCount,
    totalPatients: data.totalPatients,
    completionRate:
      completed + cancelled === 0
        ? 0
        : (completed / (completed + cancelled)) * 100,
  };
}
