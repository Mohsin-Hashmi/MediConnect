import type { AppointmentRecord } from "@/types/appointment";

// Fixed reference date keeps the demo deterministic until live appointment data is connected.
export const APPOINTMENTS_DEMO_DATE = "2026-10-07";

export const mockAppointments: AppointmentRecord[] = [
  { id: "APT-1001", patientId: "PAT-1001", patientName: "Sarah Ahmed", patientAge: 42, reason: "Cardiology follow-up", date: "2026-10-07", time: "09:30", durationMinutes: 30, visitType: "Video", status: "confirmed", feePkr: 2500, avatarTone: "blue" },
  { id: "APT-1002", patientId: "PAT-1002", patientName: "Ahmed Khan", patientAge: 52, reason: "Hypertension check", date: "2026-10-07", time: "11:00", durationMinutes: 30, visitType: "In-person", status: "confirmed", feePkr: 2500, avatarTone: "teal" },
  { id: "APT-1003", patientId: "PAT-1003", patientName: "Maria James", patientAge: 36, reason: "ECG review", date: "2026-10-07", time: "14:30", durationMinutes: 30, visitType: "Video", status: "pending", feePkr: 3000, avatarTone: "amber" },
  { id: "APT-1004", patientId: "PAT-1004", patientName: "Tariq Mahmood", patientAge: 61, reason: "Post-angioplasty review", date: "2026-10-07", time: "16:15", durationMinutes: 45, visitType: "In-person", status: "confirmed", feePkr: 3500, avatarTone: "blue" },
  { id: "APT-1005", patientId: "PAT-1005", patientName: "Zainab Malik", patientAge: 29, reason: "Routine check-up", date: "2026-10-07", time: "17:00", durationMinutes: 30, visitType: "Video", status: "completed", feePkr: 2500, avatarTone: "violet" },
  { id: "APT-1006", patientId: "PAT-1006", patientName: "Bilal Hussain", patientAge: 47, reason: "Blood pressure review", date: "2026-10-07", time: "17:30", durationMinutes: 30, visitType: "In-person", status: "confirmed", feePkr: 2500, avatarTone: "teal" },
  { id: "APT-1007", patientId: "PAT-1007", patientName: "Ayesha Noor", patientAge: 33, reason: "Cardiac consultation", date: "2026-10-07", time: "18:00", durationMinutes: 45, visitType: "Video", status: "pending", feePkr: 3000, avatarTone: "violet" },
  { id: "APT-1008", patientId: "PAT-1008", patientName: "Farhan Ali", patientAge: 55, reason: "Follow-up visit", date: "2026-10-07", time: "18:30", durationMinutes: 30, visitType: "In-person", status: "confirmed", feePkr: 2500, avatarTone: "amber" },
  { id: "APT-1009", patientId: "PAT-1009", patientName: "Hina Raza", patientAge: 39, reason: "Test results", date: "2026-10-07", time: "19:00", durationMinutes: 30, visitType: "Video", status: "confirmed", feePkr: 2500, avatarTone: "blue" },
  { id: "APT-1010", patientId: "PAT-1010", patientName: "Omar Siddiq", patientAge: 64, reason: "Medication review", date: "2026-10-07", time: "19:30", durationMinutes: 30, visitType: "In-person", status: "pending", feePkr: 2500, avatarTone: "teal" },
  { id: "APT-1011", patientId: "PAT-1011", patientName: "Nadia Sheikh", patientAge: 44, reason: "Cardiology follow-up", date: "2026-10-07", time: "20:00", durationMinutes: 30, visitType: "Video", status: "confirmed", feePkr: 2500, avatarTone: "violet" },
  { id: "APT-1012", patientId: "PAT-1012", patientName: "Usman Iqbal", patientAge: 50, reason: "Preventive screening", date: "2026-10-07", time: "20:30", durationMinutes: 30, visitType: "In-person", status: "confirmed", feePkr: 2500, avatarTone: "amber" },
  { id: "APT-1013", patientId: "PAT-1013", patientName: "Sana Mir", patientAge: 37, reason: "Chest pain assessment", date: "2026-10-08", time: "09:00", durationMinutes: 45, visitType: "In-person", status: "confirmed", feePkr: 3500, avatarTone: "teal" },
  { id: "APT-1014", patientId: "PAT-1014", patientName: "Imran Qureshi", patientAge: 58, reason: "Holter report review", date: "2026-10-08", time: "10:00", durationMinutes: 30, visitType: "Video", status: "pending", feePkr: 3000, avatarTone: "blue" },
  { id: "APT-1015", patientId: "PAT-1015", patientName: "Mehwish Tariq", patientAge: 46, reason: "Hypertension follow-up", date: "2026-10-09", time: "11:30", durationMinutes: 30, visitType: "Video", status: "confirmed", feePkr: 2500, avatarTone: "violet" },
  { id: "APT-1016", patientId: "PAT-1016", patientName: "Adnan Raza", patientAge: 41, reason: "Echo consultation", date: "2026-10-09", time: "14:00", durationMinutes: 45, visitType: "In-person", status: "confirmed", feePkr: 3500, avatarTone: "amber" },
  { id: "APT-1017", patientId: "PAT-1017", patientName: "Rabia Nasir", patientAge: 35, reason: "Routine follow-up", date: "2026-10-06", time: "12:00", durationMinutes: 30, visitType: "Video", status: "completed", feePkr: 2500, avatarTone: "blue" },
  { id: "APT-1018", patientId: "PAT-1018", patientName: "Kashif Malik", patientAge: 62, reason: "ECG and medication review", date: "2026-10-06", time: "15:30", durationMinutes: 45, visitType: "In-person", status: "completed", feePkr: 3500, avatarTone: "teal" },
  { id: "APT-1019", patientId: "PAT-1019", patientName: "Samina Ahmed", patientAge: 48, reason: "Cardiology follow-up", date: "2026-10-05", time: "10:30", durationMinutes: 30, visitType: "Video", status: "completed", feePkr: 2500, avatarTone: "violet" },
  { id: "APT-1020", patientId: "PAT-1020", patientName: "Hamza Aslam", patientAge: 31, reason: "New patient consultation", date: "2026-10-06", time: "16:00", durationMinutes: 30, visitType: "In-person", status: "cancelled", feePkr: 2500, avatarTone: "amber" },
];
