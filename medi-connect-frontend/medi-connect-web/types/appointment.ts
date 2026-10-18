export type AppointmentStatus =
  | "confirmed"
  | "pending"
  | "completed"
  | "cancelled";

export type ApiAppointmentStatus = Uppercase<AppointmentStatus>;
export type AppointmentVisitType = "Video" | "In-person";
export type AppointmentAction = "confirm" | "complete" | "cancel";

export interface ApiAppointment {
  id: string;
  patientId: string;
  doctorId: string;
  availabilityId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ApiAppointmentStatus;
  reason?: string | null;
  notes?: string | null;
  cancellationReason?: string | null;
  cancelledBy?: "patient" | "doctor" | null;
  cancelledAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiAppointmentPatient {
  id: string;
  name: string;
  email: string;
  role: "patient";
  phone?: string | null;
  profileImage?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
}

export interface DoctorAppointmentApiItem {
  appointment: ApiAppointment;
  patient: ApiAppointmentPatient | null;
}

export interface DoctorAppointmentsResponse {
  success: true;
  message: string;
  data: { appointments: DoctorAppointmentApiItem[] };
}

export interface DoctorAppointmentResponse {
  success: true;
  message: string;
  data: DoctorAppointmentApiItem;
}

export interface AppointmentMutationResponse {
  success: true;
  message: string;
  data: { appointment: ApiAppointment };
}

export interface CancelAppointmentPayload {
  appointmentId: string;
  cancellationReason: string;
}

export interface AppointmentRecord {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number | null;
  patientEmail: string | null;
  patientPhone: string | null;
  patientProfileImage: string | null;
  reason: string;
  notes: string | null;
  date: string;
  time: string;
  endTime: string;
  durationMinutes: number;
  visitType: AppointmentVisitType | null;
  status: AppointmentStatus;
  feePkr: number | null;
  cancellationReason: string | null;
  avatarTone: "blue" | "teal" | "amber" | "violet";
}

export type AppointmentSortOrder = "schedule" | "oldest" | "newest";

export interface AppointmentFilters {
  search: string;
  date: string;
  status: "all" | AppointmentStatus;
  sort: AppointmentSortOrder;
}

export interface AppointmentPageHeaderProps {
  appointments: AppointmentRecord[];
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
  onConfirm?: (appointment: AppointmentRecord) => void;
  onComplete?: (appointment: AppointmentRecord) => void;
  onCancel?: (appointment: AppointmentRecord) => void;
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
  onConfirm?: (appointment: AppointmentRecord) => void;
  onComplete?: (appointment: AppointmentRecord) => void;
  onCancel?: (appointment: AppointmentRecord) => void;
}

export interface CancelAppointmentDialogProps {
  appointment: AppointmentRecord | null;
  isPending: boolean;
  onClose: () => void;
  onConfirm: (payload: CancelAppointmentPayload) => void;
}

export interface CancelAppointmentFormValues {
  cancellationReason: string;
}
