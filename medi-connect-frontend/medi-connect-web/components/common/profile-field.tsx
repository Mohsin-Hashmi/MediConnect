import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ProfileFieldProps } from "@/types/common";

export function ProfileField({
  id,
  name,
  label,
  value,
  type = "text",
  placeholder,
  required = false,
  disabled = false,
  readOnly = false,
  error,
  icon: Icon,
  min,
  max,
  autoComplete,
  onChange,
  onBlur,
  className,
  inputClassName,
}: ProfileFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>
        {label}
        {required ? (
          <span className="ml-1 text-destructive" aria-hidden="true">
            *
          </span>
        ) : null}
      </Label>
      <div className="relative">
        {Icon ? (
          <Icon
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
        ) : null}
        <Input
          id={id}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          min={min}
          max={max}
          autoComplete={autoComplete}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn("h-11 bg-white", Icon && "pl-9", inputClassName)}
        />
      </div>
      {error ? (
        <p id={errorId} className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
