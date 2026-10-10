"use client";

import { useState } from "react";
import { addDays, addMonths, parseISO } from "date-fns";
import { CalendarDays } from "lucide-react";

import { AppointmentDetailsDialog } from "@/components/dashboard/appointments/dialogs/appointment-details-dialog";
import { NewAppointmentDialog } from "@/components/dashboard/appointments/dialogs/new-appointment-dialog";
import { useAppointments } from "@/context/appointments-context";
import { CalendarMonthGrid } from "@/components/dashboard/calendar/views/calendar-month-grid";
import { CalendarSidebar } from "@/components/dashboard/calendar/sections/calendar-sidebar";
import { CalendarTimeGrid } from "@/components/dashboard/calendar/views/calendar-time-grid";
import { CalendarToolbar } from "@/components/dashboard/calendar/sections/calendar-toolbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { APPOINTMENTS_DEMO_DATE } from "@/data/mock/appointments";
import { mockCalendarBlocks } from "@/data/mock/calendar";
import { calendarDateKey, getCalendarDays } from "@/lib/calendar-schedule";
import type { AppointmentRecord } from "@/types/appointment";
import type { CalendarView, CalendarVisitFilter } from "@/types/calendar";

export function CalendarPage() {
  const { appointments, addAppointment } = useAppointments();
  const [selectedDate, setSelectedDate] = useState(() =>
    parseISO(APPOINTMENTS_DEMO_DATE),
  );
  const [view, setView] = useState<CalendarView>("week");
  const [visitFilter, setVisitFilter] = useState<CalendarVisitFilter>("all");
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentRecord | null>(null);
  const [newAppointmentOpen, setNewAppointmentOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState(APPOINTMENTS_DEMO_DATE);
  const [bookingTime, setBookingTime] = useState("09:00");

  const visibleDays = getCalendarDays(selectedDate, view);
  const visibleAppointments = appointments.filter(
    (appointment) =>
      visibleDays.some((day) => calendarDateKey(day) === appointment.date) &&
      (visitFilter === "all" || appointment.visitType === visitFilter),
  );

  function movePeriod(direction: -1 | 1) {
    setSelectedDate((previous) =>
      view === "month"
        ? addMonths(previous, direction)
        : addDays(previous, direction * (view === "week" ? 7 : 1)),
    );
  }

  function openNewAppointment(
    date = calendarDateKey(selectedDate),
    time = "09:00",
  ) {
    setBookingDate(date);
    setBookingTime(time);
    setNewAppointmentOpen(true);
  }

  function selectMonthDate(date: Date) {
    setSelectedDate(date);
    setView("day");
  }

  return (
    <section
      aria-label="Doctor calendar"
      className="w-full flex-1 space-y-5 px-4 py-6 sm:px-5 lg:px-6 2xl:px-8"
    >
      <div>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
            <CalendarDays className="size-6 text-primary" aria-hidden="true" />
            Calendar &amp; Schedule
          </h1>
          <Badge
            variant="outline"
            className="border-blue-200 bg-blue-50 text-blue-700"
          >
            Demo data
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Review consultations and schedule patients from one shared appointment
          list.
        </p>
      </div>

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <Card className="min-w-0 gap-0 border-0 bg-white py-0 shadow-sm ring-1 ring-slate-200">
          <CalendarToolbar
            date={selectedDate}
            view={view}
            visitFilter={visitFilter}
            onToday={() => setSelectedDate(new Date())}
            onPrevious={() => movePeriod(-1)}
            onNext={() => movePeriod(1)}
            onViewChange={setView}
            onFilterChange={setVisitFilter}
            onNewAppointment={() => openNewAppointment()}
          />
          <CardContent className="px-0">
            {view === "month" ? (
              <CalendarMonthGrid
                date={selectedDate}
                appointments={visibleAppointments}
                blocks={mockCalendarBlocks}
                onSelectDate={selectMonthDate}
                onSelectAppointment={setSelectedAppointment}
              />
            ) : (
              <CalendarTimeGrid
                days={visibleDays}
                appointments={visibleAppointments}
                blocks={mockCalendarBlocks}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                onSelectAppointment={setSelectedAppointment}
                onSelectSlot={openNewAppointment}
              />
            )}
          </CardContent>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-200 px-4 py-3 text-xs text-muted-foreground">
            <span>
              <span className="mr-1 inline-block size-2 rounded-full bg-blue-500" />
              Video
            </span>
            <span>
              <span className="mr-1 inline-block size-2 rounded-full bg-teal-500" />
              In-person
            </span>
            <span>
              <span className="mr-1 inline-block size-2 rounded-full bg-amber-500" />
              Pending
            </span>
            <span>
              <span className="mr-1 inline-block size-2 rounded-full bg-indigo-400" />
              Blocked
            </span>
            <span className="sm:ml-auto">
              Click an open time to preview an appointment.
            </span>
          </div>
        </Card>
        <CalendarSidebar
          date={selectedDate}
          appointments={appointments}
          blocks={mockCalendarBlocks}
          onSelectDate={setSelectedDate}
          onSelectAppointment={setSelectedAppointment}
          onSelectSlot={openNewAppointment}
        />
      </div>

      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />
      <NewAppointmentDialog
        open={newAppointmentOpen}
        onOpenChange={setNewAppointmentOpen}
        onCreate={addAppointment}
        initialDate={bookingDate}
        initialTime={bookingTime}
      />
    </section>
  );
}
