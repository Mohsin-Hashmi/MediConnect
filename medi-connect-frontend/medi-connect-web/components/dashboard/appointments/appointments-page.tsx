"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ConfirmActionDialog } from "@/components/common/confirm-action-dialog";
import { Pagination } from "@/components/common/pagination";
import { AppointmentDetailsDialog } from "@/components/dashboard/appointments/appointment-details-dialog";
import { AppointmentFilterBar } from "@/components/dashboard/appointments/appointment-filter-bar";
import { AppointmentList } from "@/components/dashboard/appointments/appointment-list";
import { AppointmentMetrics } from "@/components/dashboard/appointments/appointment-metrics";
import { AppointmentPageHeader } from "@/components/dashboard/appointments/appointment-page-header";
import { AppointmentScheduleHeader } from "@/components/dashboard/appointments/appointment-schedule-header";
import { EditAppointmentDrawer } from "@/components/dashboard/appointments/edit-appointment-drawer";
import { NewAppointmentDialog } from "@/components/dashboard/appointments/new-appointment-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { PAGINATION_PAGE_SIZE } from "@/constants/pagination";
import { mockAppointments } from "@/data/mock/appointments";
import {
  formatAppointmentDate,
  formatAppointmentTime,
} from "@/lib/appointment-format";
import {
  getAppointmentTabCounts,
  getFilteredAppointments,
} from "@/lib/appointment-list";
import type {
  AppointmentFilters,
  AppointmentRecord,
  NewAppointmentInput,
} from "@/types/appointment";

const initialFilters: AppointmentFilters = {
  tab: "all",
  search: "",
  date: "",
  visitType: "all",
  status: "all",
  sort: "schedule",
};

export function AppointmentsPage() {
  const [appointments, setAppointments] =
    useState<AppointmentRecord[]>(mockAppointments);
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

  const tabCounts = getAppointmentTabCounts(appointments);
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

  function resetView() {
    updateFilters({
      tab: "all",
      search: "",
      date: "",
      visitType: "all",
      status: "all",
    });
  }

  function handleCreate(appointment: NewAppointmentInput) {
    setAppointments((previous) => {
      const nextNumber =
        previous.filter((item) => item.id.startsWith("DEMO-")).length + 1;
      const id = `DEMO-${String(nextNumber).padStart(4, "0")}`;
      return [
        { ...appointment, id, patientId: id.replace("DEMO", "PAT") },
        ...previous,
      ];
    });
    resetView();
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setAppointments((previous) =>
      previous.filter((item) => item.id !== deleteTarget.id),
    );
    setSelectedAppointment(null);
    setEditingAppointment(null);
    toast.success(`${deleteTarget.patientName}'s demo appointment removed.`);
    setDeleteTarget(null);
  }

  function handleSave(appointment: AppointmentRecord) {
    setAppointments((previous) =>
      previous.map((item) => (item.id === appointment.id ? appointment : item)),
    );
    setEditingAppointment(null);
    toast.success(`${appointment.patientName}'s demo appointment updated.`);
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
        <AppointmentScheduleHeader
          matchingCount={filtered.length}
          tab={filters.tab}
          tabCounts={tabCounts}
          onTabChange={(tab) => updateFilters({ tab })}
        />
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
            onResetFilters={
              hasFilters || filters.tab !== "all" ? resetView : undefined
            }
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
        description="Please check the booking details before removing it from the demo schedule."
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
        consequence="This removes the booking from the current demo page. There is no undo button."
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
