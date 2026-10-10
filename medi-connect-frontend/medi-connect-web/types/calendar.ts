import type { AppointmentRecord, AppointmentVisitType } from "@/types/appointment";

export type CalendarView = "day" | "week" | "month";
export type CalendarVisitFilter = "all" | AppointmentVisitType;

export interface CalendarBlock {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  kind: "break" | "leave";
}

export interface CalendarToolbarProps {
  date: Date;
  view: CalendarView;
  visitFilter: CalendarVisitFilter;
  onToday: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onViewChange: (view: CalendarView) => void;
  onFilterChange: (filter: CalendarVisitFilter) => void;
  onNewAppointment: () => void;
}

export interface CalendarTimeGridProps {
  days: Date[];
  appointments: AppointmentRecord[];
  blocks: CalendarBlock[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onSelectAppointment: (appointment: AppointmentRecord) => void;
  onSelectSlot: (date: string, time: string) => void;
}

export interface CalendarMonthGridProps {
  date: Date;
  appointments: AppointmentRecord[];
  blocks: CalendarBlock[];
  onSelectDate: (date: Date) => void;
  onSelectAppointment: (appointment: AppointmentRecord) => void;
}

export interface CalendarSidebarProps {
  date: Date;
  appointments: AppointmentRecord[];
  blocks: CalendarBlock[];
  onSelectDate: (date: Date) => void;
  onSelectAppointment: (appointment: AppointmentRecord) => void;
  onSelectSlot: (date: string, time: string) => void;
}
