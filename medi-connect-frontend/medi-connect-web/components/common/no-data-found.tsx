import { Inbox } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { NoDataFoundProps } from "@/types/common";

export function NoDataFound({
  title = "No data found",
  description = "There is nothing to show here yet.",
  actionLabel,
  onAction,
}: NoDataFoundProps) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center px-5 py-8 text-center">
      <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
        <Inbox className="size-6" aria-hidden="true" />
      </span>
      <p className="text-base font-semibold text-foreground">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {actionLabel && onAction ? (
        <Button type="button" variant="outline" className="mt-5 h-9 px-4" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
