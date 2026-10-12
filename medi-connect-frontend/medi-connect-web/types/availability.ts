export type VisitMode = "In-person" | "Video";

export interface AvailabilityTimeRange {
  id: string;
  startTime: string;
  endTime: string;
  mode: VisitMode;
}

export interface AvailabilityDay {
  day: string;
  enabled: boolean;
  ranges: AvailabilityTimeRange[];
}

export interface AvailabilityBlock {
  id: string;
  date: string;
  reason: string;
}

export interface AvailabilityValues {
  acceptingAppointments: boolean;
  durationMinutes: number;
  bufferMinutes: number;
  clinicName: string;
  timezone: string;
  days: AvailabilityDay[];
  blocks: AvailabilityBlock[];
}

export interface TimeRangeTarget {
  dayIndex: number;
  rangeId?: string;
}

export interface BookingSettingsProps {
  values: AvailabilityValues;
  onChange: <K extends keyof AvailabilityValues>(field: K, value: AvailabilityValues[K]) => void;
}

export interface WeeklyScheduleProps {
  days: AvailabilityDay[];
  onToggle: (index: number, enabled: boolean) => void;
  onEdit: (target: TimeRangeTarget) => void;
  onRemove: (dayIndex: number, rangeId: string) => void;
}

export interface BlockedDatesProps {
  blocks: AvailabilityBlock[];
  onAdd: () => void;
  onRemove: (id: string) => void;
}

export interface TimeRangeDialogProps {
  open: boolean;
  day: string;
  range?: AvailabilityTimeRange;
  onOpenChange: (open: boolean) => void;
  onSave: (range: Pick<AvailabilityTimeRange, "startTime" | "endTime" | "mode">) => void;
}

export interface BlockedDateDialogProps {
  open: boolean;
  existingDates: string[];
  onOpenChange: (open: boolean) => void;
  onSave: (date: string, reason: string) => void;
}
