"use client";

import { createContext, useContext, type ReactNode } from "react";
import { toast } from "sonner";

import { mockAppointments } from "@/data/mock/appointments";
import { mockCalendarBlocks } from "@/data/mock/calendar";
import { useSessionStorageValue } from "@/hooks/use-session-storage-value";
import {
  hasBlockedTimeConflict,
  hasBookingConflict,
} from "@/lib/appointment-schedule";
import { writeSessionStorage } from "@/lib/session-storage";
import type {
  AppointmentRecord,
  AppointmentsContextValue,
  NewAppointmentInput,
} from "@/types/appointment";

const STORAGE_KEY = "mediconnect:demo-appointments:v1";
const AppointmentsContext = createContext<AppointmentsContextValue | null>(
  null,
);

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const storedAppointments =
    useSessionStorageValue<AppointmentRecord[]>(STORAGE_KEY);
  const appointments = Array.isArray(storedAppointments)
    ? storedAppointments
    : mockAppointments;

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

    const id = `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    writeSessionStorage(STORAGE_KEY, [
      { ...input, id, patientId: id.replace("DEMO", "PAT") },
      ...appointments,
    ]);
    toast.success(
      "Demo appointment added to the calendar and appointment list.",
    );
    return true;
  }

  function updateAppointment(updated: AppointmentRecord) {
    writeSessionStorage(
      STORAGE_KEY,
      appointments.map((item) => (item.id === updated.id ? updated : item)),
    );
  }

  function removeAppointment(id: string) {
    writeSessionStorage(
      STORAGE_KEY,
      appointments.filter((item) => item.id !== id),
    );
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
