import type {
  EarningTransaction,
  RevenueChartPoint,
  SettlementAccountData,
} from "@/types/earnings";

export const EARNINGS_TRANSACTIONS_FIXTURE: EarningTransaction[] = [
  { id: "earning-001", reference: "MC-7001", patientLabel: "Patient A.", consultationDate: "2026-10-18", service: "Cardiology consultation", grossAmount: 2500, platformFee: 250, netAmount: 2250, status: "settled" },
  { id: "earning-002", reference: "MC-7002", patientLabel: "Patient B.", consultationDate: "2026-10-17", service: "Follow-up consultation", grossAmount: 2000, platformFee: 200, netAmount: 1800, status: "pending" },
  { id: "earning-003", reference: "MC-7003", patientLabel: "Patient C.", consultationDate: "2026-10-16", service: "Cardiology consultation", grossAmount: 2500, platformFee: 250, netAmount: 2250, status: "settled" },
  { id: "earning-004", reference: "MC-7004", patientLabel: "Patient D.", consultationDate: "2026-10-15", service: "Diagnostic review", grossAmount: 3000, platformFee: 300, netAmount: 2700, status: "settled" },
  { id: "earning-005", reference: "MC-7005", patientLabel: "Patient E.", consultationDate: "2026-10-14", service: "Follow-up consultation", grossAmount: 2000, platformFee: 200, netAmount: 1800, status: "refunded" },
  { id: "earning-006", reference: "MC-7006", patientLabel: "Patient F.", consultationDate: "2026-10-12", service: "Cardiology consultation", grossAmount: 2500, platformFee: 250, netAmount: 2250, status: "settled" },
  { id: "earning-007", reference: "MC-7007", patientLabel: "Patient G.", consultationDate: "2026-10-10", service: "Follow-up consultation", grossAmount: 2000, platformFee: 200, netAmount: 1800, status: "pending" },
  { id: "earning-008", reference: "MC-7008", patientLabel: "Patient H.", consultationDate: "2026-10-08", service: "Cardiology consultation", grossAmount: 2500, platformFee: 250, netAmount: 2250, status: "settled" },
  { id: "earning-009", reference: "MC-7009", patientLabel: "Patient I.", consultationDate: "2026-10-06", service: "Diagnostic review", grossAmount: 3000, platformFee: 300, netAmount: 2700, status: "settled" },
  { id: "earning-010", reference: "MC-7010", patientLabel: "Patient J.", consultationDate: "2026-10-04", service: "Follow-up consultation", grossAmount: 2000, platformFee: 200, netAmount: 1800, status: "settled" },
  { id: "earning-011", reference: "MC-7011", patientLabel: "Patient K.", consultationDate: "2026-10-02", service: "Cardiology consultation", grossAmount: 2500, platformFee: 250, netAmount: 2250, status: "settled" },
  { id: "earning-012", reference: "MC-7012", patientLabel: "Patient L.", consultationDate: "2026-09-30", service: "Cardiology consultation", grossAmount: 2500, platformFee: 250, netAmount: 2250, status: "settled" },
];

export const REVENUE_CHART_FIXTURE: RevenueChartPoint[] = [
  { period: "Sep 21", gross: 6000, net: 5400 },
  { period: "Sep 28", gross: 8500, net: 7650 },
  { period: "Oct 5", gross: 10500, net: 9450 },
  { period: "Oct 12", gross: 12000, net: 10800 },
  { period: "Oct 19", gross: 7500, net: 6750 },
];

export const SETTLEMENT_ACCOUNT_FIXTURE: SettlementAccountData = {
  bankName: "MediConnect test settlement account",
  accountTitle: "Doctor workspace",
  maskedAccount: "PK00 •••• •••• 4821",
  payoutSchedule: "Manual payout requests",
};
