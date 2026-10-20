"use client";

import { useState } from "react";
import { toast } from "sonner";

import { DataSectionHeader } from "@/components/common/data-section-header";
import { Pagination } from "@/components/common/pagination";
import { EarningsFilterBar } from "@/components/dashboard/earnings/filters/earnings-filter-bar";
import { EarningsTransactionList } from "@/components/dashboard/earnings/list/earnings-transaction-list";
import { EarningsMetrics } from "@/components/dashboard/earnings/sections/earnings-metrics";
import { EarningsPageHeader } from "@/components/dashboard/earnings/sections/earnings-page-header";
import { RevenueOverview } from "@/components/dashboard/earnings/sections/revenue-overview";
import { SettlementAccount } from "@/components/dashboard/earnings/sections/settlement-account";
import { Card, CardContent } from "@/components/ui/card";
import { PAGINATION_PAGE_SIZE } from "@/constants/pagination";
import { EARNINGS_TRANSACTIONS_FIXTURE, REVENUE_CHART_FIXTURE, SETTLEMENT_ACCOUNT_FIXTURE } from "@/data/mock/earnings";
import { getEarningsMetrics, getFilteredEarnings } from "@/lib/earnings";
import type { EarningsFilters } from "@/types/earnings";

const initialFilters: EarningsFilters = { search: "", status: "all", sort: "newest" };

export function EarningsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const filtered = getFilteredEarnings(EARNINGS_TRANSACTIONS_FIXTURE, filters);
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / PAGINATION_PAGE_SIZE)));
  const visible = filtered.slice((currentPage - 1) * PAGINATION_PAGE_SIZE, currentPage * PAGINATION_PAGE_SIZE);
  const hasFilters = filters.search !== "" || filters.status !== "all";

  function updateFilters(changes: Partial<EarningsFilters>) { setFilters((previous) => ({ ...previous, ...changes })); setPage(1); }
  function resetFilters() { setFilters(initialFilters); setPage(1); }
  function showPreviewMessage() { toast.info("Payout account integration is not connected yet."); }

  return (
    <section aria-label="Doctor earnings" className="w-full flex-1 space-y-5 px-4 py-6 sm:px-5 lg:px-6 2xl:px-8">
      <EarningsPageHeader transactions={filtered} onRequestPayout={showPreviewMessage} />
      <EarningsMetrics metrics={getEarningsMetrics(EARNINGS_TRANSACTIONS_FIXTURE)} />
      <div className="grid min-w-0 items-stretch gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <RevenueOverview data={REVENUE_CHART_FIXTURE} />
        <SettlementAccount account={SETTLEMENT_ACCOUNT_FIXTURE} onManage={showPreviewMessage} />
      </div>
      <Card className="min-w-0 gap-0 border-0 py-0 shadow-sm ring-1 ring-slate-200/90">
        <DataSectionHeader title="Recent transactions" description="Consultation earnings and estimated settlement status from preview data." countLabel={`${filtered.length} matching transactions`} />
        <CardContent className="px-0">
          <EarningsFilterBar filters={filters} onChange={updateFilters} onReset={resetFilters} hasFilters={hasFilters} />
          <EarningsTransactionList transactions={visible} onResetFilters={hasFilters ? resetFilters : undefined} />
          <Pagination currentPage={currentPage} totalItems={filtered.length} onPageChange={setPage} itemLabel="transactions" />
        </CardContent>
      </Card>
    </section>
  );
}
