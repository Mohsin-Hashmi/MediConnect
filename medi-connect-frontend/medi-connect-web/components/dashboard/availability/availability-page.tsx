"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

import { ConfirmActionDialog } from "@/components/common/confirm-action-dialog";
import { Pagination } from "@/components/common/pagination";
import { TimeRangeDialog } from "@/components/dashboard/availability/dialogs/time-range-dialog";
import { AvailabilityFilterBar } from "@/components/dashboard/availability/filters/availability-filter-bar";
import { AvailabilityPageHeader } from "@/components/dashboard/availability/sections/availability-page-header";
import { AvailabilityScheduleHeader } from "@/components/dashboard/availability/sections/availability-schedule-header";
import { ScheduleSummary } from "@/components/dashboard/availability/sections/schedule-summary";
import { WeeklySchedule } from "@/components/dashboard/availability/sections/weekly-schedule";
import { Card, CardContent } from "@/components/ui/card";
import { PAGINATION_PAGE_SIZE } from "@/constants/pagination";
import {
  useCreateAvailability,
  useDeleteAvailability,
  useDoctorAvailability,
  useUpdateAvailability,
} from "@/hooks/apis/availability/use-availability";
import { getApiErrorMessage } from "@/lib/api-error";
import { getFilteredAvailabilities } from "@/lib/availability-list";
import type {
  AvailabilityFilters,
  AvailabilityFormValues,
  AvailabilityPayload,
  AvailabilityRecord,
} from "@/types/availability";

const initialFilters: AvailabilityFilters = {
  search: "",
  date: "",
  status: "all",
  sort: "schedule",
};

function toPayload(values: AvailabilityFormValues): AvailabilityPayload {
  return { ...values, slotDuration: Number(values.slotDuration) };
}

export function AvailabilityPage() {
  const query = useDoctorAvailability();
  const createMutation = useCreateAvailability();
  const updateMutation = useUpdateAvailability();
  const deleteMutation = useDeleteAvailability();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<AvailabilityRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AvailabilityRecord | null>(
    null,
  );
  const availabilities = query.data ?? [];
  const filtered = getFilteredAvailabilities(availabilities, filters);
  const currentPage = Math.min(
    page,
    Math.max(1, Math.ceil(filtered.length / PAGINATION_PAGE_SIZE)),
  );
  const visible = filtered.slice(
    (currentPage - 1) * PAGINATION_PAGE_SIZE,
    currentPage * PAGINATION_PAGE_SIZE,
  );
  const hasFilters =
    filters.search !== "" || filters.date !== "" || filters.status !== "all";

  function updateFilters(changes: Partial<AvailabilityFilters>) {
    setFilters((previous) => ({ ...previous, ...changes }));
    setPage(1);
  }

  function resetFilters() {
    setFilters(initialFilters);
    setPage(1);
  }

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }
  function openEdit(availability: AvailabilityRecord) {
    setEditing(availability);
    setDialogOpen(true);
  }

  function saveAvailability(values: AvailabilityFormValues) {
    const payload = toPayload(values);
    const mutation = editing
      ? updateMutation.mutateAsync({ id: editing.id, payload })
      : createMutation.mutateAsync(payload);
    void mutation
      .then((response) => {
        toast.success(response.message);
        setDialogOpen(false);
        setEditing(null);
      })
      .catch((error) =>
        toast.error(
          getApiErrorMessage(error, "Availability could not be saved."),
        ),
      );
  }

  function deleteAvailability() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    void deleteMutation
      .mutateAsync(target.id)
      .then((response) => {
        toast.success(response.message);
        setDeleteTarget(null);
      })
      .catch((error) =>
        toast.error(
          getApiErrorMessage(error, "Availability could not be deleted."),
        ),
      );
  }

  return (
    <section
      aria-label="Doctor availability"
      className="w-full flex-1 space-y-5 px-4 py-6 sm:px-5 lg:px-6 2xl:px-8"
    >
      <AvailabilityPageHeader availabilities={filtered} onAdd={openCreate} />
      <ScheduleSummary availabilities={availabilities} />
      <Card className="min-w-0 gap-0 border-0 py-0 shadow-sm ring-1 ring-slate-200/90">
        <AvailabilityScheduleHeader matchingCount={filtered.length} />
        <CardContent className="px-0">
          <AvailabilityFilterBar
            filters={filters}
            onChange={updateFilters}
            onReset={resetFilters}
            hasFilters={hasFilters}
          />
          <WeeklySchedule
            availabilities={visible}
            isLoading={query.isLoading}
            error={
              query.isError
                ? getApiErrorMessage(
                    query.error,
                    "Your availability could not be loaded.",
                  )
                : null
            }
            onRetry={() => void query.refetch()}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
            onResetFilters={hasFilters ? resetFilters : undefined}
          />
          {!query.isLoading && !query.isError ? (
            <Pagination
              currentPage={currentPage}
              totalItems={filtered.length}
              onPageChange={setPage}
              itemLabel="availability windows"
            />
          ) : null}
        </CardContent>
      </Card>
      <TimeRangeDialog
        key={editing?.id ?? (dialogOpen ? "new-open" : "new-closed")}
        open={dialogOpen}
        availability={editing}
        isPending={createMutation.isPending || updateMutation.isPending}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditing(null);
        }}
        onSave={saveAvailability}
      />
      <ConfirmActionDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete availability window?"
        description="Patients will no longer be able to book slots from this window."
        confirmLabel="Delete window"
        destructive
        details={
          deleteTarget
            ? [
                {
                  label: "Date",
                  value: format(parseISO(deleteTarget.date), "d MMM yyyy"),
                },
                {
                  label: "Time",
                  value: `${deleteTarget.startTime} - ${deleteTarget.endTime}`,
                },
              ]
            : []
        }
        consequence="This action permanently removes the availability window."
        onConfirm={deleteAvailability}
      />
    </section>
  );
}
