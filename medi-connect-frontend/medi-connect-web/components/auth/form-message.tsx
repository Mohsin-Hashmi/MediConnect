import { AlertCircle, CheckCircle2 } from "lucide-react";

interface FormMessageProps {
  message: string;
  variant?: "error" | "success";
}

export function FormMessage({ message, variant = "error" }: FormMessageProps) {
  const Icon = variant === "success" ? CheckCircle2 : AlertCircle;

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={
        variant === "success"
          ? "flex items-start gap-2.5 rounded-xl border border-secondary/20 bg-secondary/5 p-3.5 text-sm text-secondary"
          : "flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 p-3.5 text-sm text-destructive"
      }
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
