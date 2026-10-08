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
