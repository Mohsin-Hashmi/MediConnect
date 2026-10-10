export type PatientGender = "Female" | "Male" | "Other";
export type PatientStatus = "active" | "inactive";
export type PatientAgeGroup = "all" | "under-18" | "18-39" | "40-59" | "60-plus";
export type PatientSort = "recent" | "name" | "next";

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: PatientGender;
  email: string;
  careFocus: string;
  lastVisitDate: string | null;
  nextAppointmentDate: string | null;
  visitCount: number;
  registeredAt: string;
  status: PatientStatus;
}

export interface PatientFilters {
  search: string;
  gender: "all" | PatientGender;
  ageGroup: PatientAgeGroup;
  status: "all" | PatientStatus;
  sort: PatientSort;
}

export interface PatientFormValues {
  name: string;
  age: string;
  gender: PatientGender;
  email: string;
  careFocus: string;
  status: PatientStatus;
}

export interface PatientMetricsData {
  total: number;
  active: number;
  upcoming: number;
  recentlyRegistered: number;
}

export interface PatientPageHeaderProps {
  patients: PatientRecord[];
  onNewPatient: () => void;
}

export interface PatientDirectoryHeaderProps {
  matchingCount: number;
}

export interface PatientFilterBarProps {
  filters: PatientFilters;
  onChange: (changes: Partial<PatientFilters>) => void;
  onReset: () => void;
}

export interface PatientListProps {
  patients: PatientRecord[];
  onView: (patient: PatientRecord) => void;
  onEdit: (patient: PatientRecord) => void;
  onDelete: (patient: PatientRecord) => void;
  onResetFilters?: () => void;
}

export interface PatientIdentityProps {
  patient: PatientRecord;
}
