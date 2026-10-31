import type { ApiAppointmentStatus } from "@/types/appointment";

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
      status: ApiAppointmentStatus;
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

export interface PatientPageHeaderProps { patients: ApiDoctorPatient[] }
export interface PatientDirectoryHeaderProps { matchingCount: number }
export interface PatientFilterBarProps {
  filters: PatientFilters;
  onChange: (changes: Partial<PatientFilters>) => void;
  onReset: () => void;
}
export interface PatientListProps {
  patients: ApiDoctorPatient[];
  onView: (patient: ApiDoctorPatient) => void;
  onResetFilters?: () => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}
export interface PatientIdentityProps { patient: ApiDoctorPatient }
export interface PatientActionsProps {
  patient: ApiDoctorPatient;
  onView: (patient: ApiDoctorPatient) => void;
}
