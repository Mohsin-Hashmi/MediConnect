import { Circle, CircleCheckBig, CircleMinus, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ChecklistItemProps, ChecklistItemStatus } from "@/types/common";

const statusStyles: Record<
  ChecklistItemStatus,
  { icon: typeof Circle; className: string }
> = {
  complete: { icon: CircleCheckBig, className: "text-emerald-600" },
  incomplete: { icon: Circle, className: "text-slate-400" },
  warning: { icon: TriangleAlert, className: "text-amber-600" },
  neutral: { icon: CircleMinus, className: "text-slate-500" },
};

export function ChecklistItem({
  label,
  status = "complete",
  className,
}: ChecklistItemProps) {
  const { icon: Icon, className: iconClassName } = statusStyles[status];

  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      <Icon className={cn("size-4 shrink-0", iconClassName)} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
