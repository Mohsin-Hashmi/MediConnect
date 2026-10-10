"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ConfirmActionDialog } from "@/components/common/confirm-action-dialog";
import { Pagination } from "@/components/common/pagination";
import { PatientDetailsDialog } from "@/components/dashboard/patients/dialogs/patient-details-dialog";
import { PatientDirectoryHeader } from "@/components/dashboard/patients/sections/patient-directory-header";
import { PatientFilters } from "@/components/dashboard/patients/filters/patient-filters";
import { PatientFormDialog } from "@/components/dashboard/patients/dialogs/patient-form-dialog";
import { PatientList } from "@/components/dashboard/patients/list/patient-list";
import { PatientMetrics } from "@/components/dashboard/patients/sections/patient-metrics";
import { PatientPageHeader } from "@/components/dashboard/patients/sections/patient-page-header";
import { Card, CardContent } from "@/components/ui/card";
import { PAGINATION_PAGE_SIZE } from "@/constants/pagination";
import { mockPatients, PATIENTS_REFERENCE_DATE } from "@/data/mock/patients";
import { getFilteredPatients, getPatientMetrics } from "@/lib/patient-list";
import type {
  PatientFilters as PatientFilterValues,
  PatientFormValues,
  PatientRecord,
} from "@/types/patient";

const initialFilters: PatientFilterValues = {
  search: "",
  gender: "all",
  ageGroup: "all",
  status: "all",
  sort: "recent",
};

export function PatientsPage() {
  const patients = mockPatients;
  const [filters, setFilters] = useState<PatientFilterValues>(initialFilters);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<PatientRecord | null>(null);
  const [editing, setEditing] = useState<PatientRecord | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PatientRecord | null>(null);
  const filtered = getFilteredPatients(patients, filters);
  const currentPage = Math.min(
    page,
    Math.max(1, Math.ceil(filtered.length / PAGINATION_PAGE_SIZE)),
  );
  const visible = filtered.slice(
    (currentPage - 1) * PAGINATION_PAGE_SIZE,
    currentPage * PAGINATION_PAGE_SIZE,
  );
  const hasFilters =
    filters.search !== "" ||
    filters.gender !== "all" ||
    filters.ageGroup !== "all" ||
    filters.status !== "all";

  function updateFilters(changes: Partial<PatientFilterValues>) {
    setFilters((previous) => ({ ...previous, ...changes }));
    setPage(1);
  }
  function resetFilters() {
    setFilters(initialFilters);
    setPage(1);
  }
  // Save patient API function handler
  function savePatient(
    _values: PatientFormValues,
    original: PatientRecord | null,
  ) {
    if (original) {
      toast.success("Patient update preview completed. No changes were saved.");
    } else {
      toast.success("Patient form validated. No record was added.");
    }
    setFormOpen(false);
    setEditing(null);
  }
  // Delete patient API function handler
  function deletePatient() {
    if (!deleteTarget) return;
    setSelected(null);
    setDeleteTarget(null);
    toast.success("Patient deletion preview completed. No record was removed.");
  }
  return (
    <section
      aria-label="Doctor patients"
      className="w-full flex-1 space-y-5 px-4 py-6 sm:px-5 lg:px-6 2xl:px-8"
    >
      <PatientPageHeader
        patients={filtered}
        onNewPatient={() => {
          setEditing(null);
          setFormOpen(true);
        }}
      />
      <PatientMetrics
        metrics={getPatientMetrics(patients, PATIENTS_REFERENCE_DATE)}
      />
      <Card className="min-w-0 gap-0 border-0 py-0 shadow-sm ring-1 ring-slate-200/90">
        <PatientDirectoryHeader matchingCount={filtered.length} />
        <CardContent className="px-0">
          <PatientFilters
            filters={filters}
            onChange={updateFilters}
            onReset={resetFilters}
          />
          <PatientList
            patients={visible}
            onView={setSelected}
            onEdit={(patient) => {
              setEditing(patient);
              setFormOpen(true);
            }}
            onDelete={setDeleteTarget}
            onResetFilters={hasFilters ? resetFilters : undefined}
          />
          <Pagination
            currentPage={currentPage}
            totalItems={filtered.length}
            onPageChange={setPage}
            itemLabel="patients"
          />
        </CardContent>
      </Card>
      <PatientDetailsDialog
        patient={selected}
        onClose={() => setSelected(null)}
        onEdit={(patient) => {
          setEditing(patient);
          setFormOpen(true);
        }}
      />
      <PatientFormDialog
        open={formOpen}
        patient={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSave={savePatient}
      />
      <ConfirmActionDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Remove patient?"
        description="Review this patient before previewing the removal. No record will be deleted."
        destructive
        confirmLabel="Remove patient"
        details={
          deleteTarget
            ? [
                { label: "Patient", value: deleteTarget.name },
                { label: "Patient ID", value: deleteTarget.id },
              ]
            : []
        }
        consequence="This is a UI preview only. The patient directory will remain unchanged."
        onConfirm={deletePatient}
      />
    </section>
  );
}
