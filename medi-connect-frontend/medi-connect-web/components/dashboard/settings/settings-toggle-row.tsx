import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { SettingsToggleRowProps } from "@/types/settings";

export function SettingsToggleRow({
  id,
  title,
  description,
  checked,
  disabled = false,
  badge,
  onCheckedChange,
}: SettingsToggleRowProps) {
  return (
    <div className="flex min-h-20 items-start justify-between gap-4 py-4 sm:gap-5">
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <Label htmlFor={id} className="text-sm font-semibold text-foreground">
            {title}
          </Label>
          {badge ? (
            <Badge variant="outline" className="bg-slate-50 font-normal text-slate-600">
              {badge}
            </Badge>
          ) : null}
        </div>
        <p className="max-w-2xl text-sm leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
      <Switch
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        aria-describedby={`${id}-description`}
        className="mt-0.5 shrink-0"
      />
      <span id={`${id}-description`} className="sr-only">
        {description}
      </span>
    </div>
  );
}
