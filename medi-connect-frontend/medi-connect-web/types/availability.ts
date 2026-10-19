export interface AvailabilityRecord {
  id: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  slotDuration: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilityFormValues {
  date: string;
  startTime: string;
  endTime: string;
  slotDuration: string;
  isAvailable: boolean;
}

export interface AvailabilityPayload {
  date: string;
  startTime: string;
  endTime: string;
  slotDuration: number;
  isAvailable: boolean;
}

export interface AvailabilityListResponse {
  success: true;
  message: string;
  data: { availabilities: AvailabilityRecord[] };
}

export interface AvailabilityMutationResponse {
  success: true;
  message: string;
  data: { availability: AvailabilityRecord };
}

export interface UpdateAvailabilityVariables {
  id: string;
  payload: AvailabilityPayload;
}

export type AvailabilityStatusFilter = "all" | "available" | "paused";
export type AvailabilitySortOrder = "schedule" | "oldest" | "newest";

export interface AvailabilityFilters {
  search: string;
  date: string;
  status: AvailabilityStatusFilter;
  sort: AvailabilitySortOrder;
}

export interface AvailabilityFilterBarProps {
  filters: AvailabilityFilters;
  onChange: (changes: Partial<AvailabilityFilters>) => void;
  onReset: () => void;
  hasFilters: boolean;
}

export interface AvailabilityDateFilterProps {
  date: string;
  onDateChange: (date: string) => void;
}

export interface AvailabilityPageHeaderProps {
  availabilities: AvailabilityRecord[];
  onAdd: () => void;
}

export interface AvailabilityScheduleHeaderProps {
  matchingCount: number;
}

export interface TimeRangeDialogProps {
  open: boolean;
  availability: AvailabilityRecord | null;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: AvailabilityFormValues) => void;
}

export interface AvailabilityScheduleProps {
  availabilities: AvailabilityRecord[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onEdit: (availability: AvailabilityRecord) => void;
  onDelete: (availability: AvailabilityRecord) => void;
  onResetFilters?: () => void;
}

export interface AvailabilityActionsProps {
  availability: AvailabilityRecord;
  onEdit: (availability: AvailabilityRecord) => void;
  onDelete: (availability: AvailabilityRecord) => void;
}
