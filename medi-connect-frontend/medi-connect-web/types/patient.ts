import type { AppointmentStatus } from "@/types/appointment";

export interface ApiDoctorPatient {
  patient: {
    id: string;
    name: string;
    email: string;
    role: "patient";
    phone?: string | null;
    profileImage?: string | null;
    dateOfBirth?: string | null;
    gender?: string | null;
  };
  appointmentSummary: {
    total: number;
    upcoming: number;
    completed: number;
    latest: {
      date: string;
      status: Uppercase<AppointmentStatus>;
      reason?: string | null;
    };
  };
}

export interface DoctorPatientsResponse {
  success: true;
  message: string;
  data: { patients: ApiDoctorPatient[] };
}

export type PatientAgeGroup = "all" | "under-18" | "18-39" | "40-59" | "60-plus";
export type PatientSort = "recent" | "name";

export interface PatientRecord {
  id: string;
  name: string;
  age: number | null;
  gender: string | null;
  email: string | null;
  phone: string | null;
  profileImage: string | null;
  latestReason: string;
  latestAppointmentDate: string;
  latestAppointmentStatus: AppointmentStatus;
  appointmentCount: number;
  upcomingAppointmentCount: number;
  completedAppointmentCount: number;
}

export interface PatientFilters {
  search: string;
  gender: "all" | "Female" | "Male" | "Other";
  ageGroup: PatientAgeGroup;
  sort: PatientSort;
}

export interface PatientMetricsData {
  total: number;
  appointments: number;
  upcoming: number;
  completed: number;
}

export interface PatientPageHeaderProps { patients: PatientRecord[] }
export interface PatientDirectoryHeaderProps { matchingCount: number }
export interface PatientFilterBarProps {
  filters: PatientFilters;
  onChange: (changes: Partial<PatientFilters>) => void;
  onReset: () => void;
}
export interface PatientListProps {
  patients: PatientRecord[];
  onView: (patient: PatientRecord) => void;
  onResetFilters?: () => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}
export interface PatientIdentityProps { patient: PatientRecord }
export interface PatientActionsProps {
  patient: PatientRecord;
  onView: (patient: PatientRecord) => void;
}
