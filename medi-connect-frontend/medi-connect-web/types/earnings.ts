export type EarningStatus = "settled" | "pending" | "refunded";
export type EarningsSortOrder = "newest" | "oldest" | "highest";

export interface EarningTransaction {
  id: string;
  reference: string;
  patientLabel: string;
  consultationDate: string;
  service: string;
  grossAmount: number;
  platformFee: number;
  netAmount: number;
  status: EarningStatus;
}

export interface EarningsFilters {
  search: string;
  status: "all" | EarningStatus;
  sort: EarningsSortOrder;
}

export interface EarningsMetricsData {
  totalRevenue: number;
  completedConsultations: number;
  availableForPayout: number;
  pendingClearance: number;
}

export interface RevenueChartPoint {
  period: string;
  gross: number;
  net: number;
}

export interface SettlementAccountData {
  bankName: string;
  accountTitle: string;
  maskedAccount: string;
  payoutSchedule: string;
}

export interface EarningsPageHeaderProps {
  transactions: EarningTransaction[];
  onRequestPayout: () => void;
}

export interface EarningsMetricsProps {
  metrics: EarningsMetricsData;
}

export interface RevenueOverviewProps {
  data: RevenueChartPoint[];
}

export interface SettlementAccountProps {
  account: SettlementAccountData;
  onManage: () => void;
}

export interface EarningsFilterBarProps {
  filters: EarningsFilters;
  onChange: (changes: Partial<EarningsFilters>) => void;
  onReset: () => void;
  hasFilters: boolean;
}

export interface EarningsTransactionListProps {
  transactions: EarningTransaction[];
  onResetFilters?: () => void;
}
