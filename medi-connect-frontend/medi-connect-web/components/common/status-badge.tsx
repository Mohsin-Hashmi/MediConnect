import { cn } from "cn";

import { Badge } from "@/components/ui/badge";

const toneClasses = {
  info: "bg-blue-50 text-blue-700 ring-blue-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  neutral: "bg-slate-100 text-slate-700 ring-slate-200",
  danger: "bg-red-50 text-red-700 ring-red-200",
} as const;

export type StatusTone = keyof typeof toneClasses;

interface StatusBadgeProps {
  status: string;
  tone?: StatusTone;
  className?: string;
}

export function StatusBadge({
  status,
  tone = "neutral",
  className,
}: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-6 border-0 px-2.5 text-xs font-medium capitalize ring-1",
        toneClasses[tone],
        className,
      )}
    >
      {status}
    </Badge>
  );
}
