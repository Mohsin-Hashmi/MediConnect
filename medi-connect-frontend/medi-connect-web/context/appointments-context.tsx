"use client";

import { createContext, useContext, type ReactNode } from "react";
import { toast } from "sonner";

import { mockAppointments } from "@/data/mock/appointments";
import { mockCalendarBlocks } from "@/data/mock/calendar";
import {
  hasBlockedTimeConflict,
  hasBookingConflict,
} from "@/lib/appointment-schedule";
import type {
  AppointmentRecord,
  AppointmentsContextValue,
  NewAppointmentInput,
} from "@/types/appointment";

const AppointmentsContext = createContext<AppointmentsContextValue | null>(
  null,
);

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const appointments = mockAppointments;

  function addAppointment(input: NewAppointmentInput) {
    if (hasBookingConflict(appointments, input)) {
      toast.error(
        "This time overlaps an existing appointment. Choose another slot.",
      );
      return false;
    }
    if (hasBlockedTimeConflict(mockCalendarBlocks, input)) {
      toast.error("This time is blocked on the calendar. Choose another slot.");
      return false;
    }

    // API integration point: validate the preview without changing the list.
    toast.info("Appointment form previewed. No booking was created.");
    return true;
  }

  function updateAppointment(updated: AppointmentRecord) {
    // API integration point: no record is updated until an endpoint is connected.
    void updated;
    toast.info("Appointment update previewed. No changes were saved.");
  }

  function removeAppointment(id: string) {
    // API integration point: no record is deleted until an endpoint is connected.
    void id;
    toast.info("Appointment deletion previewed. No booking was removed.");
  }

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        addAppointment,
        updateAppointment,
        removeAppointment,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointments() {
  const context = useContext(AppointmentsContext);
  if (!context)
    throw new Error("useAppointments must be used inside AppointmentsProvider");
  return context;
}
