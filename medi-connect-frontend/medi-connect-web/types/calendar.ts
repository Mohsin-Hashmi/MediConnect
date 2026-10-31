import type { DoctorAppointmentApiItem } from "@/types/appointment";

export type CalendarView = "day" | "week" | "month";

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
  onToday: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onViewChange: (view: CalendarView) => void;
}

export interface CalendarTimeGridProps {
  days: Date[];
  appointments: DoctorAppointmentApiItem[];
  blocks: CalendarBlock[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onSelectAppointment: (appointment: DoctorAppointmentApiItem) => void;
}

export interface CalendarMonthGridProps {
  date: Date;
  appointments: DoctorAppointmentApiItem[];
  blocks: CalendarBlock[];
  onSelectDate: (date: Date) => void;
  onSelectAppointment: (appointment: DoctorAppointmentApiItem) => void;
}

export interface CalendarSidebarProps {
  date: Date;
  appointments: DoctorAppointmentApiItem[];
  blocks: CalendarBlock[];
  onSelectDate: (date: Date) => void;
  onSelectAppointment: (appointment: DoctorAppointmentApiItem) => void;
}
