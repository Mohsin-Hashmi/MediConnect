import { CircleAlert, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ErrorProps } from "@/types/common";

export function Error({
  title = "Something went wrong",
  message = "We could not load this data. Please try again.",
  onRetry,
}: ErrorProps) {
  return (
    <div role="alert" className="flex min-h-56 flex-col items-center justify-center px-5 py-8 text-center">
      <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-red-50 text-destructive">
        <CircleAlert className="size-6" aria-hidden="true" />
      </span>
      <p className="text-base font-semibold text-foreground">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
      {onRetry ? (
        <Button type="button" variant="outline" className="mt-5 h-9 px-4" onClick={onRetry}>
          <RotateCcw className="size-4" aria-hidden="true" />Retry
        </Button>
      ) : null}
    </div>
  );
}
