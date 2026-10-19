"use client";

import { useState } from "react";

import { Pagination } from "@/components/common/pagination";
import { PatientDetailsDialog } from "@/components/dashboard/patients/dialogs/patient-details-dialog";
import { PatientFilters } from "@/components/dashboard/patients/filters/patient-filters";
import { PatientList } from "@/components/dashboard/patients/list/patient-list";
import { PatientDirectoryHeader } from "@/components/dashboard/patients/sections/patient-directory-header";
import { PatientMetrics } from "@/components/dashboard/patients/sections/patient-metrics";
import { PatientPageHeader } from "@/components/dashboard/patients/sections/patient-page-header";
import { Card, CardContent } from "@/components/ui/card";
import { PAGINATION_PAGE_SIZE } from "@/constants/pagination";
import { useDoctorPatients } from "@/hooks/apis/patients/use-patients";
import { getApiErrorMessage } from "@/lib/api-error";
import { getFilteredPatients, getPatientMetrics } from "@/lib/patient-list";
import type { PatientFilters as PatientFilterValues, PatientRecord } from "@/types/patient";

const initialFilters: PatientFilterValues = { search: "", gender: "all", ageGroup: "all", sort: "recent" };

export function PatientsPage() {
  const patientsQuery = useDoctorPatients();
  const patients = patientsQuery.data ?? [];
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<PatientRecord | null>(null);
  const filtered = getFilteredPatients(patients, filters);
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / PAGINATION_PAGE_SIZE)));
  const visible = filtered.slice((currentPage - 1) * PAGINATION_PAGE_SIZE, currentPage * PAGINATION_PAGE_SIZE);
  const hasFilters = filters.search !== "" || filters.gender !== "all" || filters.ageGroup !== "all";

  function updateFilters(changes: Partial<PatientFilterValues>) {
    setFilters((previous) => ({ ...previous, ...changes }));
    setPage(1);
  }

  function resetFilters() {
    setFilters(initialFilters);
    setPage(1);
  }

  return (
    <section aria-label="Doctor patients" className="w-full flex-1 space-y-5 px-4 py-6 sm:px-5 lg:px-6 2xl:px-8">
      <PatientPageHeader patients={filtered} />
      <PatientMetrics metrics={getPatientMetrics(patients)} />
      <Card className="min-w-0 gap-0 border-0 py-0 shadow-sm ring-1 ring-slate-200/90">
        <PatientDirectoryHeader matchingCount={filtered.length} />
        <CardContent className="px-0">
          <PatientFilters filters={filters} onChange={updateFilters} onReset={resetFilters} />
          <PatientList
            patients={visible}
            onView={setSelected}
            onResetFilters={hasFilters ? resetFilters : undefined}
            isLoading={patientsQuery.isLoading}
            error={patientsQuery.isError ? getApiErrorMessage(patientsQuery.error, "The patient directory could not be loaded.") : null}
            onRetry={() => void patientsQuery.refetch()}
          />
          {!patientsQuery.isLoading && !patientsQuery.isError ? <Pagination currentPage={currentPage} totalItems={filtered.length} onPageChange={setPage} itemLabel="patients" /> : null}
        </CardContent>
      </Card>
      <PatientDetailsDialog patient={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
