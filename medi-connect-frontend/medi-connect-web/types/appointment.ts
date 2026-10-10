export type AppointmentStatus =
  | "confirmed"
  | "pending"
  | "completed"
  | "cancelled";

export type AppointmentVisitType = "Video" | "In-person";

export interface AppointmentRecord {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  reason: string;
  date: string;
  time: string;
  durationMinutes: number;
  visitType: AppointmentVisitType;
  status: AppointmentStatus;
  feePkr: number;
  avatarTone: "blue" | "teal" | "amber" | "violet";
}

export type AppointmentSortOrder = "schedule" | "oldest" | "newest";
export type NewAppointmentInput = Omit<AppointmentRecord, "id" | "patientId">;

export interface AppointmentFilters {
  search: string;
  date: string;
  visitType: "all" | AppointmentVisitType;
  status: "all" | AppointmentStatus;
  sort: AppointmentSortOrder;
}

export interface AppointmentPageHeaderProps {
  appointments: AppointmentRecord[];
  onNewAppointment: () => void;
}

export interface AppointmentScheduleHeaderProps {
  matchingCount: number;
}

export interface AppointmentFilterBarProps {
  filters: AppointmentFilters;
  onChange: (changes: Partial<AppointmentFilters>) => void;
  onReset: () => void;
  hasFilters: boolean;
}

export interface AppointmentDateFilterProps {
  date: string;
  onDateChange: (date: string) => void;
}

export interface NewAppointmentFormValues {
  patientName: string;
  patientAge: string;
  reason: string;
  date: string;
  time: string;
  visitType: AppointmentVisitType;
  feePkr: string;
}

export interface NewAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (appointment: NewAppointmentInput) => boolean;
  initialDate?: string;
  initialTime?: string;
}

export interface AppointmentsContextValue {
  appointments: AppointmentRecord[];
  addAppointment: (appointment: NewAppointmentInput) => boolean;
  updateAppointment: (appointment: AppointmentRecord) => void;
  removeAppointment: (id: string) => void;
}

export interface AppointmentDetailsDialogProps {
  appointment: AppointmentRecord | null;
  onClose: () => void;
}

export interface AppointmentListProps {
  appointments: AppointmentRecord[];
  onView: (appointment: AppointmentRecord) => void;
  onResetFilters?: () => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onEdit?: (appointment: AppointmentRecord) => void;
  onDelete?: (appointment: AppointmentRecord) => void;
}

export interface AppointmentMetricsProps {
  appointments: AppointmentRecord[];
}

export interface AppointmentPatientCellProps {
  appointment: AppointmentRecord;
}

export interface AppointmentActionsProps {
  appointment: AppointmentRecord;
  onView: (appointment: AppointmentRecord) => void;
  onEdit?: (appointment: AppointmentRecord) => void;
  onDelete?: (appointment: AppointmentRecord) => void;
}

export interface EditAppointmentDrawerProps {
  appointment: AppointmentRecord | null;
  onClose: () => void;
  onSave: (appointment: AppointmentRecord) => void;
}

export interface EditAppointmentFormValues {
  patientName: string;
  patientAge: string;
  reason: string;
  date: string;
  time: string;
  durationMinutes: string;
  visitType: AppointmentVisitType;
  status: AppointmentStatus;
  feePkr: string;
}

export interface EditAppointmentFormProps {
  appointment: AppointmentRecord;
  onClose: () => void;
  onSave: (appointment: AppointmentRecord) => void;
}
