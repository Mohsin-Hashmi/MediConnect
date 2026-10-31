import type { DoctorAppointmentApiItem } from "@/types/appointment";

export interface AppointmentWeekdayActivity {
  day: string;
  completed: number;
  confirmed: number;
  cancelled: number;
}

export interface DashboardMetricsData {
  todayAppointments: number;
  upcomingAppointments: number;
  patientsWithAppointments: number;
  completionRate: number;
}

export interface DashboardMetricsProps {
  appointments: DoctorAppointmentApiItem[];
}

export interface DashboardAppointmentsProps {
  appointments: DoctorAppointmentApiItem[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export interface DashboardSidePanelsProps {
  nextAppointment: DoctorAppointmentApiItem | null;
}

export interface DashboardActivityPanelsProps {
  appointments: DoctorAppointmentApiItem[];
}

export interface WeeklyActivityChartProps {
  activity: AppointmentWeekdayActivity[];
}

export interface DashboardPatientAvatarProps {
  appointment: DoctorAppointmentApiItem;
}

export interface DashboardPlaceholderProps {
  title: string;
  icon: import("lucide-react").LucideIcon;
}
