import { format, parseISO } from "date-fns";

import { Amount } from "@/components/common/amount";
import { NoDataFound } from "@/components/common/no-data-found";
import { StatusBadge } from "@/components/common/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPkr } from "@/lib/earnings";
import type { StatusTone } from "@/types/common";
import type {
  EarningStatus,
  EarningsTransactionListProps,
} from "@/types/earnings";

const statusTones: Record<EarningStatus, StatusTone> = {
  settled: "success",
  pending: "warning",
  refunded: "danger",
};

export function EarningsTransactionList({
  transactions,
  onResetFilters,
}: EarningsTransactionListProps) {
  if (transactions.length === 0)
    return (
      <NoDataFound
        title="No transactions found"
        description="Try another search term or clear the current filters."
        actionLabel={onResetFilters ? "Clear filters" : undefined}
        onAction={onResetFilters}
      />
    );

  return (
    <>
      <div className="hidden overflow-x-auto xl:block">
        <Table>
          <TableHeader className="bg-slate-50/90">
            <TableRow className="hover:bg-transparent">
              {[
                "Reference",
                "Consultation",
                "Service",
                "Gross",
                "Platform fee",
                "Net earnings",
                "Status",
              ].map((label) => (
                <TableHead
                  key={label}
                  className="text-xs uppercase tracking-wide text-muted-foreground first:pl-5 last:pr-5"
                >
                  {label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="pl-5">
                  <p className="font-semibold">{transaction.reference}</p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.patientLabel}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="font-medium">
                    {format(
                      parseISO(transaction.consultationDate),
                      "d MMM yyyy",
                    )}
                  </p>
                </TableCell>
                <TableCell className="max-w-64">
                  <p className="truncate">{transaction.service}</p>
                </TableCell>
                <TableCell className="font-medium tabular-nums">
                  {formatPkr(transaction.grossAmount)}
                </TableCell>
                <TableCell className="text-red-600 tabular-nums">
                  -{formatPkr(transaction.platformFee)}
                </TableCell>
                <TableCell className="font-semibold tabular-nums">
                  {formatPkr(transaction.netAmount)}
                </TableCell>
                <TableCell className="pr-5">
                  <StatusBadge
                    status={transaction.status}
                    tone={statusTones[transaction.status]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="divide-y xl:hidden">
        {transactions.map((transaction) => (
          <article key={transaction.id} className="space-y-3 px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{transaction.reference}</p>
                <p className="text-xs text-muted-foreground">
                  {transaction.patientLabel} ·{" "}
                  {format(parseISO(transaction.consultationDate), "d MMM yyyy")}
                </p>
              </div>
              <StatusBadge
                status={transaction.status}
                tone={statusTones[transaction.status]}
              />
            </div>
            <p className="text-sm">{transaction.service}</p>
            <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-50 p-3 text-xs">
              <Amount
                label="Gross"
                value={formatPkr(transaction.grossAmount)}
              />
              <Amount
                label="Fee"
                value={`-${formatPkr(transaction.platformFee)}`}
              />
              <Amount
                label="Net"
                value={formatPkr(transaction.netAmount)}
                strong
              />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
