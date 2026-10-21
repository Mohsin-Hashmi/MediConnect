import {
  Building2,
  CalendarClock,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

import { IconText } from "@/components/common/icon-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SettlementAccountProps } from "@/types/earnings";

export function SettlementAccount({
  account,
  onManage,
}: SettlementAccountProps) {
  return (
    <Card className="h-full gap-0 py-0 shadow-sm ring-slate-200/90">
      <CardHeader className="border-b px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Settlement account</CardTitle>
          <Badge variant="secondary">Preview</Badge>
        </div>
        <CardDescription>No payout account is connected yet.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-5 py-5">
        <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-white text-primary ring-1 ring-slate-200">
              <Building2 className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-semibold">{account.bankName}</p>
              <p className="text-xs text-muted-foreground">
                {account.accountTitle}
              </p>
            </div>
          </div>
          <p className="mt-4 font-mono text-sm font-semibold tracking-wide">
            {account.maskedAccount}
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <IconText icon={CalendarClock} text={account.payoutSchedule} />
          <IconText
            icon={ShieldCheck}
            text="Account verification will be required before payouts."
          />
        </div>
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full gap-2"
          onClick={onManage}
        >
          <CreditCard className="size-4" />
          Manage payout account
        </Button>
      </CardContent>
    </Card>
  );
}
