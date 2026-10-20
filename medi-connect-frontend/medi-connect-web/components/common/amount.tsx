import { cn } from "@/lib/utils";
import type { AmountProps } from "@/types/common";

export function Amount({
  label,
  value,
  strong = false,
  className,
}: AmountProps) {
  return (
    <div className={className}>
      <p className="text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-1 tabular-nums",
          strong ? "font-semibold" : "font-medium",
        )}
      >
        {value}
      </p>
    </div>
  );
}
