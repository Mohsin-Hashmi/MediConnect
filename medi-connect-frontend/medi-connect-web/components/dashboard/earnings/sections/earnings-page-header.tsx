import { HandCoins } from "lucide-react";

import { DashboardPageHeader } from "@/components/common/dashboard-page-header";
import { PdfExportButton } from "@/components/common/pdf-export-button";
import { Button } from "@/components/ui/button";
import { formatPkr } from "@/lib/earnings";
import type { EarningsPageHeaderProps } from "@/types/earnings";

export function EarningsPageHeader({
  transactions,
  onRequestPayout,
}: EarningsPageHeaderProps) {
  return (
    <DashboardPageHeader
      title="Earnings & finances"
      description="Preview consultation revenue, settlement amounts, and transaction activity."
      actions={
        <>
          <PdfExportButton
            title="MediConnect earnings statement"
            subtitle={`${transactions.length} transactions in the current view | UI preview data`}
            filename="mediconnect-earnings-statement"
            label="Export statement"
            headers={["Reference", "Date", "Patient", "Service", "Gross", "Fee", "Net", "Status"]}
            rows={transactions.map((transaction) => [
              transaction.reference,
              transaction.consultationDate,
              transaction.patientLabel,
              transaction.service,
              formatPkr(transaction.grossAmount),
              formatPkr(transaction.platformFee),
              formatPkr(transaction.netAmount),
              transaction.status,
            ])}
            className="h-10 gap-2 px-4"
          />
          <Button type="button" className="h-10 gap-2 px-4" onClick={onRequestPayout}>
            <HandCoins className="size-4" />
            Request payout
          </Button>
        </>
      }
    />
  );
}
