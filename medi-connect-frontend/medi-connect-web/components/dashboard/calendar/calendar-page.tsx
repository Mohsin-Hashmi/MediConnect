"use client";

import { useState } from "react";
import { addDays, addMonths } from "date-fns";
import { CalendarDays } from "lucide-react";

import { Error as ErrorState } from "@/components/common/error";
import { Loader } from "@/components/common/loader";
import { AppointmentDetailsDialog } from "@/components/dashboard/appointments/dialogs/appointment-details-dialog";
import { CalendarSidebar } from "@/components/dashboard/calendar/sections/calendar-sidebar";
import { CalendarToolbar } from "@/components/dashboard/calendar/sections/calendar-toolbar";
import { CalendarMonthGrid } from "@/components/dashboard/calendar/views/calendar-month-grid";
import { CalendarTimeGrid } from "@/components/dashboard/calendar/views/calendar-time-grid";
import { Card, CardContent } from "@/components/ui/card";
import { useDoctorAppointments } from "@/hooks/apis/appointments/use-appointments";
import { calendarDateKey, getCalendarDays } from "@/lib/calendar-schedule";
import { getApiErrorMessage } from "@/lib/api-error";
import type { AppointmentRecord } from "@/types/appointment";
import type { CalendarBlock, CalendarView } from "@/types/calendar";

export function CalendarPage() {
  const appointmentsQuery = useDoctorAppointments();
  const appointments = appointmentsQuery.data ?? [];
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [view, setView] = useState<CalendarView>("week");
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentRecord | null>(null);
  const calendarBlocks: CalendarBlock[] = [];

  const visibleDays = getCalendarDays(selectedDate, view);
  const visibleAppointments = appointments.filter((appointment) =>
    visibleDays.some((day) => calendarDateKey(day) === appointment.date),
  );

  function movePeriod(direction: -1 | 1) {
    setSelectedDate((previous) =>
      view === "month"
        ? addMonths(previous, direction)
        : addDays(previous, direction * (view === "week" ? 7 : 1)),
    );
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
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Review patient-booked consultations from the shared appointment schedule.
        </p>
      </div>

      {appointmentsQuery.isPending ? (
        <Card className="border-0 shadow-sm ring-1 ring-slate-200">
          <Loader label="Loading calendar appointments..." />
        </Card>
      ) : appointmentsQuery.isError ? (
        <Card className="border-0 shadow-sm ring-1 ring-slate-200">
          <ErrorState
            title="Could not load the calendar"
            message={getApiErrorMessage(
              appointmentsQuery.error,
              "The appointment schedule could not be loaded.",
            )}
            onRetry={() => void appointmentsQuery.refetch()}
          />
        </Card>
      ) : (
        <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_19rem]">
          <Card className="min-w-0 gap-0 border-0 bg-white py-0 shadow-sm ring-1 ring-slate-200">
            <CalendarToolbar
              date={selectedDate}
              view={view}
              onToday={() => setSelectedDate(new Date())}
              onPrevious={() => movePeriod(-1)}
              onNext={() => movePeriod(1)}
              onViewChange={setView}
            />
            <CardContent className="px-0">
              {view === "month" ? (
                <CalendarMonthGrid
                  date={selectedDate}
                  appointments={visibleAppointments}
                  blocks={calendarBlocks}
                  onSelectDate={selectMonthDate}
                  onSelectAppointment={setSelectedAppointment}
                />
              ) : (
                <CalendarTimeGrid
                  days={visibleDays}
                  appointments={visibleAppointments}
                  blocks={calendarBlocks}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                  onSelectAppointment={setSelectedAppointment}
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
            </div>
          </Card>
          <CalendarSidebar
            date={selectedDate}
            appointments={appointments}
            blocks={calendarBlocks}
            onSelectDate={setSelectedDate}
            onSelectAppointment={setSelectedAppointment}
          />
        </div>
      )}

      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />
    </section>
  );
}
