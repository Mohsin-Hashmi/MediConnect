"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ConfirmActionDialog } from "@/components/common/confirm-action-dialog";
import { Pagination } from "@/components/common/pagination";
import { AppointmentDetailsDialog } from "@/components/dashboard/appointments/dialogs/appointment-details-dialog";
import { CancelAppointmentDialog } from "@/components/dashboard/appointments/dialogs/cancel-appointment-dialog";
import { AppointmentFilterBar } from "@/components/dashboard/appointments/filters/appointment-filter-bar";
import { AppointmentList } from "@/components/dashboard/appointments/list/appointment-list";
import { AppointmentMetrics } from "@/components/dashboard/appointments/sections/appointment-metrics";
import { AppointmentPageHeader } from "@/components/dashboard/appointments/sections/appointment-page-header";
import { AppointmentScheduleHeader } from "@/components/dashboard/appointments/sections/appointment-schedule-header";
import { Card, CardContent } from "@/components/ui/card";
import { PAGINATION_PAGE_SIZE } from "@/constants/pagination";
import {
  useCancelAppointment,
  useCompleteAppointment,
  useConfirmAppointment,
  useDoctorAppointments,
} from "@/hooks/apis/appointments/use-appointments";
import { formatAppointmentDate, formatAppointmentTime } from "@/lib/appointment-format";
import { getFilteredAppointments } from "@/lib/appointment-list";
import { getApiErrorMessage } from "@/lib/api-error";
import type {
  AppointmentAction,
  AppointmentFilters,
  AppointmentRecord,
  CancelAppointmentPayload,
} from "@/types/appointment";

const initialFilters: AppointmentFilters = {
  search: "",
  date: "",
  status: "all",
  sort: "schedule",
};

type StatusActionTarget = {
  action: Exclude<AppointmentAction, "cancel">;
  appointment: AppointmentRecord;
};

export function AppointmentsPage() {
  const appointmentsQuery = useDoctorAppointments();
  const confirmAppointment = useConfirmAppointment();
  const completeAppointment = useCompleteAppointment();
  const cancelAppointment = useCancelAppointment();
  const appointments = appointmentsQuery.data ?? [];
  const [filters, setFilters] = useState<AppointmentFilters>(initialFilters);
  const [page, setPage] = useState(1);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentRecord | null>(null);
  const [statusActionTarget, setStatusActionTarget] =
    useState<StatusActionTarget | null>(null);
  const [cancelTarget, setCancelTarget] = useState<AppointmentRecord | null>(null);

  const filtered = getFilteredAppointments(appointments, filters);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGINATION_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (currentPage - 1) * PAGINATION_PAGE_SIZE,
    currentPage * PAGINATION_PAGE_SIZE,
  );
  const hasFilters =
    filters.search !== "" || filters.date !== "" || filters.status !== "all";

  function updateFilters(changes: Partial<AppointmentFilters>) {
    setFilters((previous) => ({ ...previous, ...changes }));
    setPage(1);
  }

  function resetFilters() {
    updateFilters({ search: "", date: "", status: "all" });
  }

  function handleStatusAction() {
    if (!statusActionTarget) return;

    const mutation =
      statusActionTarget.action === "confirm"
        ? confirmAppointment
        : completeAppointment;
    const successMessage =
      statusActionTarget.action === "confirm"
        ? "Appointment confirmed."
        : "Appointment marked as completed.";

    mutation.mutate(statusActionTarget.appointment.id, {
      onSuccess: () => {
        toast.success(successMessage);
        setStatusActionTarget(null);
        setSelectedAppointment(null);
      },
      onError: (error) => toast.error(getApiErrorMessage(error)),
    });
  }

  function handleCancel(payload: CancelAppointmentPayload) {
    cancelAppointment.mutate(payload, {
      onSuccess: () => {
        toast.success("Appointment cancelled.");
        setCancelTarget(null);
        setSelectedAppointment(null);
      },
      onError: (error) => toast.error(getApiErrorMessage(error)),
    });
  }

  const actionAppointment = statusActionTarget?.appointment;
  const actionLabel = statusActionTarget?.action === "confirm" ? "Confirm" : "Complete";

  return (
    <section
      aria-label="Doctor appointments"
      className="w-full flex-1 space-y-5 px-4 py-6 sm:px-5 lg:px-6 2xl:px-8"
    >
      <AppointmentPageHeader appointments={filtered} />
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
            onConfirm={(appointment) =>
              setStatusActionTarget({ action: "confirm", appointment })
            }
            onComplete={(appointment) =>
              setStatusActionTarget({ action: "complete", appointment })
            }
            onCancel={setCancelTarget}
            onResetFilters={hasFilters ? resetFilters : undefined}
            isLoading={appointmentsQuery.isPending}
            error={
              appointmentsQuery.isError
                ? getApiErrorMessage(
                    appointmentsQuery.error,
                    "The appointment schedule could not be loaded.",
                  )
                : null
            }
            onRetry={() => void appointmentsQuery.refetch()}
          />
          {!appointmentsQuery.isPending && !appointmentsQuery.isError ? (
            <Pagination
              currentPage={currentPage}
              totalItems={filtered.length}
              onPageChange={setPage}
              itemLabel="appointments"
            />
          ) : null}
        </CardContent>
      </Card>

      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />
      <ConfirmActionDialog
        open={statusActionTarget !== null}
        onOpenChange={(open) => !open && setStatusActionTarget(null)}
        title={`${actionLabel} appointment?`}
        description={
          statusActionTarget?.action === "confirm"
            ? "Confirm that this patient booking has been accepted."
            : "Mark this consultation as completed only after it has taken place."
        }
        details={
          actionAppointment
            ? [
                { label: "Patient", value: actionAppointment.patientName },
                {
                  label: "Appointment",
                  value: `${formatAppointmentDate(actionAppointment.date)} at ${formatAppointmentTime(actionAppointment.time)}`,
                },
              ]
            : undefined
        }
        onConfirm={handleStatusAction}
        confirmLabel={`${actionLabel} appointment`}
      />
      <CancelAppointmentDialog
        appointment={cancelTarget}
        isPending={cancelAppointment.isPending}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
      />
    </section>
  );
}
