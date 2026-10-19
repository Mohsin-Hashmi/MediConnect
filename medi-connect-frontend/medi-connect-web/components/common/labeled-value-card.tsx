import { cn } from "@/lib/utils";
import type { LabeledValueCardProps } from "@/types/common";

export function LabeledValueCard({
  label,
  value,
  className,
}: LabeledValueCardProps) {
  return (
    <div className={cn("rounded-lg bg-white p-3 ring-1 ring-slate-200", className)}>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}
