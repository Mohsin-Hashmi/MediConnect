import type {
  EarningTransaction,
  EarningsFilters,
  EarningsMetricsData,
} from "@/types/earnings";

export function formatPkr(amount: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getEarningsMetrics(
  transactions: EarningTransaction[],
): EarningsMetricsData {
  return transactions.reduce<EarningsMetricsData>(
    (metrics, transaction) => {
      if (transaction.status !== "refunded") {
        metrics.totalRevenue += transaction.grossAmount;
        metrics.completedConsultations += 1;
      }
      if (transaction.status === "settled") {
        metrics.availableForPayout += transaction.netAmount;
      }
      if (transaction.status === "pending") {
        metrics.pendingClearance += transaction.netAmount;
      }
      return metrics;
    },
    {
      totalRevenue: 0,
      completedConsultations: 0,
      availableForPayout: 0,
      pendingClearance: 0,
    },
  );
}

export function getFilteredEarnings(
  transactions: EarningTransaction[],
  filters: EarningsFilters,
) {
  const search = filters.search.trim().toLowerCase();
  const filtered = transactions.filter((transaction) => {
    const matchesSearch =
      search === "" ||
      transaction.reference.toLowerCase().includes(search) ||
      transaction.patientLabel.toLowerCase().includes(search) ||
      transaction.service.toLowerCase().includes(search);
    const matchesStatus =
      filters.status === "all" || transaction.status === filters.status;
    return matchesSearch && matchesStatus;
  });

  return [...filtered].sort((first, second) => {
    if (filters.sort === "highest") return second.netAmount - first.netAmount;
    const difference =
      new Date(second.consultationDate).getTime() -
      new Date(first.consultationDate).getTime();
    return filters.sort === "oldest" ? -difference : difference;
  });
}
