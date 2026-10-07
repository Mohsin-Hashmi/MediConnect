export type DashboardAppointmentStatus =
  | "confirmed"
  | "pending"
  | "completed";

export type DashboardVisitType = "Video" | "In-person";

export interface DashboardAppointment {
  id: string;
  patientName: string;
  initials: string;
  reason: string;
  time: string;
  visitType: DashboardVisitType;
  status: DashboardAppointmentStatus;
  avatarTone: "blue" | "teal" | "amber" | "violet";
}

export interface WeeklyAppointmentActivity {
  day: string;
  completed: number;
  confirmed: number;
  cancelled: number;
}

export interface DashboardAvailabilitySlot {
  day: string;
  hours: string;
  mode: "In-clinic" | "Telehealth" | "Hybrid";
}

export interface DoctorDashboardMockData {
  doctor: {
    firstName: string;
    specialty: string;
  };
  appointments: DashboardAppointment[];
  upcomingAppointmentsCount: number;
  totalPatients: number;
  weeklyActivity: WeeklyAppointmentActivity[];
  nextAppointmentId: string;
  patientCohort: {
    newPatientsPercent: number;
    returningPatientsPercent: number;
  };
  availability: DashboardAvailabilitySlot[];
}
