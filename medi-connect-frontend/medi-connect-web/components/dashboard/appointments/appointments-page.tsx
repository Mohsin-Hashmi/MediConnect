"use client";

import { useState } from "react";

import { ConfirmActionDialog } from "@/components/common/confirm-action-dialog";
import { Pagination } from "@/components/common/pagination";
import { AppointmentDetailsDialog } from "@/components/dashboard/appointments/dialogs/appointment-details-dialog";
import { AppointmentFilterBar } from "@/components/dashboard/appointments/filters/appointment-filter-bar";
import { AppointmentList } from "@/components/dashboard/appointments/list/appointment-list";
import { AppointmentMetrics } from "@/components/dashboard/appointments/sections/appointment-metrics";
import { AppointmentPageHeader } from "@/components/dashboard/appointments/sections/appointment-page-header";
import { AppointmentScheduleHeader } from "@/components/dashboard/appointments/sections/appointment-schedule-header";
import { EditAppointmentDrawer } from "@/components/dashboard/appointments/drawer/edit-appointment-drawer";
import { NewAppointmentDialog } from "@/components/dashboard/appointments/dialogs/new-appointment-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { PAGINATION_PAGE_SIZE } from "@/constants/pagination";
import { useAppointments } from "@/context/appointments-context";
import {
  formatAppointmentDate,
  formatAppointmentTime,
} from "@/lib/appointment-format";
import { getFilteredAppointments } from "@/lib/appointment-list";
import type { AppointmentFilters, AppointmentRecord } from "@/types/appointment";

const initialFilters: AppointmentFilters = {
  search: "",
  date: "",
  visitType: "all",
  status: "all",
  sort: "schedule",
};

export function AppointmentsPage() {
  const { appointments, addAppointment, updateAppointment, removeAppointment } = useAppointments();
  const [filters, setFilters] = useState<AppointmentFilters>(initialFilters);
  const [page, setPage] = useState(1);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentRecord | null>(null);
  const [editingAppointment, setEditingAppointment] =
    useState<AppointmentRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AppointmentRecord | null>(
    null,
  );
  const [newAppointmentOpen, setNewAppointmentOpen] = useState(false);

  const filtered = getFilteredAppointments(appointments, filters);
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGINATION_PAGE_SIZE),
  );
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (currentPage - 1) * PAGINATION_PAGE_SIZE,
    currentPage * PAGINATION_PAGE_SIZE,
  );
  const hasFilters =
    filters.search !== "" ||
    filters.date !== "" ||
    filters.visitType !== "all" ||
    filters.status !== "all";

  function updateFilters(changes: Partial<AppointmentFilters>) {
    setFilters((previous) => ({ ...previous, ...changes }));
    setPage(1);
  }

  function resetFilters() {
    updateFilters({ search: "", date: "", visitType: "all", status: "all" });
  }

  function handleCreate(appointment: Parameters<typeof addAppointment>[0]) {
    return addAppointment(appointment);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    removeAppointment(deleteTarget.id);
    setSelectedAppointment(null);
    setEditingAppointment(null);
    setDeleteTarget(null);
  }

  function handleSave(appointment: AppointmentRecord) {
    updateAppointment(appointment);
    setEditingAppointment(null);
  }

  return (
    <section
      aria-label="Doctor appointments"
      className="w-full flex-1 space-y-5 px-4 py-6 sm:px-5 lg:px-6 2xl:px-8"
    >
      <AppointmentPageHeader
        appointments={filtered}
        onNewAppointment={() => setNewAppointmentOpen(true)}
      />
      <AppointmentMetrics appointments={appointments} />

      <Card className="min-w-0 gap-0 border-0 py-0 shadow-sm ring-1 ring-slate-200/90">
        <AppointmentScheduleHeader matchingCount={filtered.length} />
        <CardContent className="px-0">
          <AppointmentFilterBar
            filters={filters}
            onChange={updateFilters}
            onReset={resetFilters}
            hasFilters={hasFilters}
          />
          <AppointmentList
            appointments={visible}
            onView={setSelectedAppointment}
            onEdit={setEditingAppointment}
            onDelete={setDeleteTarget}
            onResetFilters={hasFilters ? resetFilters : undefined}
          />
          <Pagination
            currentPage={currentPage}
            totalItems={filtered.length}
            onPageChange={setPage}
            itemLabel="appointments"
          />
        </CardContent>
      </Card>

      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />
      <EditAppointmentDrawer
        appointment={editingAppointment}
        onClose={() => setEditingAppointment(null)}
        onSave={handleSave}
      />
      <ConfirmActionDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this appointment?"
        description="Review the booking details before previewing this action. No appointment will be removed."
        details={
          deleteTarget
            ? [
                { label: "Patient", value: deleteTarget.patientName },
                {
                  label: "Appointment",
                  value: `${formatAppointmentDate(deleteTarget.date)} at ${formatAppointmentTime(deleteTarget.time)}`,
                },
                { label: "Booking ID", value: deleteTarget.id },
              ]
            : undefined
        }
        consequence="This is a UI preview only. The appointment list and calendar will remain unchanged."
        onConfirm={handleDelete}
        confirmLabel="Delete appointment"
        cancelLabel="Keep appointment"
        destructive
      />
      <NewAppointmentDialog
        open={newAppointmentOpen}
        onOpenChange={setNewAppointmentOpen}
        onCreate={handleCreate}
      />
    </section>
  );
}
