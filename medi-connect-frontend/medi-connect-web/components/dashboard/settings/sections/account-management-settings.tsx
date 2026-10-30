import { Download, Trash2, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AccountManagementSettingsProps } from "@/types/settings";

export function AccountManagementSettings({
  onExport,
  onDelete,
}: AccountManagementSettingsProps) {
  return (
    <Card
      id="account-management"
      className="scroll-mt-24 gap-0 border-0 py-0 shadow-sm ring-1 ring-slate-200/90"
    >
      <CardHeader className="border-b px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <TriangleAlert className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle>Account management</CardTitle>
            <CardDescription className="mt-1">
              Access your account data or review permanent account actions.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Download className="mt-0.5 size-4.5 text-slate-500" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold">Download account data</p>
              <p className="mt-1 max-w-2xl text-sm leading-5 text-muted-foreground">
                Request an export after a secure data-export workflow is available.
              </p>
            </div>
          </div>
          <Button type="button" variant="outline" onClick={onExport}>
            Request export
          </Button>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-red-200 bg-red-50/55 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Trash2 className="mt-0.5 size-4.5 text-destructive" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-red-950">Delete account</p>
              <p className="mt-1 max-w-2xl text-sm leading-5 text-red-800/80">
                Account deletion is unavailable until linked appointments, availability, and retention rules are handled safely.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            className="border-red-200 bg-white text-destructive hover:bg-red-50 hover:text-destructive"
            onClick={onDelete}
          >
            Review deletion
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
