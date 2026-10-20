import type {
  ChangeEventHandler,
  FocusEventHandler,
  ReactNode,
} from "react";
import type { LucideIcon } from "lucide-react";

export type StatusTone = "info" | "warning" | "success" | "neutral" | "danger";

export interface StatusBadgeProps {
  status: string;
  tone?: StatusTone;
  className?: string;
}

export interface PdfExportButtonProps {
  title: string;
  subtitle?: string;
  filename: string;
  headers: string[];
  rows: string[][];
  label?: string;
  className?: string;
}

export interface LoaderProps {
  label?: string;
  rows?: number;
}

export interface NoDataFoundProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export interface ErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export interface ConfirmActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  details?: ReadonlyArray<{ label: string; value: string }>;
  consequence?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export interface ProfileFieldProps {
  id: string;
  name: string;
  label: string;
  value: string | number;
  type?: "text" | "email" | "tel" | "url" | "number";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  icon?: LucideIcon;
  min?: number;
  max?: number;
  autoComplete?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur: FocusEventHandler<HTMLInputElement>;
  className?: string;
  inputClassName?: string;
}

export interface DashboardPageHeaderProps {
  title: string;
  description: string;
  actions?: ReactNode;
}

export interface DataSectionHeaderProps {
  title: string;
  description: ReactNode;
  countLabel?: string;
  icon?: LucideIcon;
}

export interface LabeledValueCardProps {
  label: string;
  value: ReactNode;
  className?: string;
}

export interface IconTextProps {
  icon: LucideIcon;
  text: ReactNode;
  className?: string;
  iconClassName?: string;
}

export type ChecklistItemStatus =
  | "complete"
  | "incomplete"
  | "warning"
  | "neutral";

export interface ChecklistItemProps {
  label: ReactNode;
  status?: ChecklistItemStatus;
  className?: string;
}

export interface AmountProps {
  label: string;
  value: string;
  strong?: boolean;
  className?: string;
}
