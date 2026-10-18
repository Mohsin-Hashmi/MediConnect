import type { AppointmentRecord } from "@/types/appointment";

export interface WeeklyAppointmentActivity {
  day: string;
  date: string;
  completed: number;
  confirmed: number;
  cancelled: number;
}

export interface DashboardMetricsProps {
  appointments: AppointmentRecord[];
}

export interface DashboardAppointmentsProps {
  appointments: AppointmentRecord[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export interface DashboardSidePanelsProps {
  nextAppointment: AppointmentRecord | null;
}

export interface DashboardActivityPanelsProps {
  appointments: AppointmentRecord[];
}

export interface WeeklyActivityChartProps {
  activity: WeeklyAppointmentActivity[];
}

export interface DashboardPatientAvatarProps {
  appointment: AppointmentRecord;
}

export interface DashboardPlaceholderProps {
  title: string;
  icon: import("lucide-react").LucideIcon;
}
