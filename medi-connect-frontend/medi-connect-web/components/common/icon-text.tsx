import { cn } from "@/lib/utils";
import type { IconTextProps } from "@/types/common";

export function IconText({
  icon: Icon,
  text,
  className,
  iconClassName,
}: IconTextProps) {
  return (
    <div className={cn("flex items-start gap-2 text-muted-foreground", className)}>
      <Icon
        className={cn("mt-0.5 size-4 shrink-0", iconClassName)}
        aria-hidden="true"
      />
      <span className="leading-relaxed">{text}</span>
    </div>
  );
}
