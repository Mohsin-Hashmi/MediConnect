import { CardHeader, CardTitle } from "@/components/ui/card";
import type { DataSectionHeaderProps } from "@/types/common";

export function DataSectionHeader({
  title,
  description,
  countLabel,
  icon: Icon,
}: DataSectionHeaderProps) {
  return (
    <CardHeader className="gap-0 border-b px-5 py-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <CardTitle className="flex items-center gap-2 font-semibold">
            {Icon ? <Icon className="size-4 text-primary" aria-hidden="true" /> : null}
            {title}
          </CardTitle>
          <div className="mt-1 text-xs text-muted-foreground">{description}</div>
        </div>
        {countLabel ? (
          <span className="shrink-0 text-sm text-muted-foreground">
            {countLabel}
          </span>
        ) : null}
      </div>
    </CardHeader>
  );
}
