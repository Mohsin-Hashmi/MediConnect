import type { AvailabilityRecord } from "@/types/availability";

// Shared appointment values
export type ApiAppointmentStatus =
  | "CONFIRMED"
  | "PENDING"
  | "COMPLETED"
  | "CANCELLED";
export type AppointmentAction = "confirm" | "complete" | "cancel";

// Backend API contracts
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
  availability: AvailabilityRecord | null;
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

export type AppointmentSortOrder = "schedule" | "oldest" | "newest";

export interface AppointmentFilters {
  search: string;
  date: string;
  status: "all" | ApiAppointmentStatus;
  sort: AppointmentSortOrder;
}

// Component props
export interface AppointmentPageHeaderProps {
  appointments: DoctorAppointmentApiItem[];
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
  appointment: DoctorAppointmentApiItem | null;
  onClose: () => void;
}

export interface AppointmentListProps {
  appointments: DoctorAppointmentApiItem[];
  onView: (appointment: DoctorAppointmentApiItem) => void;
  onResetFilters?: () => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onConfirm?: (appointment: DoctorAppointmentApiItem) => void;
  onComplete?: (appointment: DoctorAppointmentApiItem) => void;
  onCancel?: (appointment: DoctorAppointmentApiItem) => void;
}

export interface AppointmentMetricsProps {
  appointments: DoctorAppointmentApiItem[];
}

export interface AppointmentPatientCellProps {
  appointment: DoctorAppointmentApiItem;
}

export interface AppointmentActionsProps {
  appointment: DoctorAppointmentApiItem;
  onView: (appointment: DoctorAppointmentApiItem) => void;
  onConfirm?: (appointment: DoctorAppointmentApiItem) => void;
  onComplete?: (appointment: DoctorAppointmentApiItem) => void;
  onCancel?: (appointment: DoctorAppointmentApiItem) => void;
}

export interface CancelAppointmentDialogProps {
  appointment: DoctorAppointmentApiItem | null;
  isPending: boolean;
  onClose: () => void;
  onConfirm: (payload: CancelAppointmentPayload) => void;
}

// Form values
export interface CancelAppointmentFormValues {
  cancellationReason: string;
}
