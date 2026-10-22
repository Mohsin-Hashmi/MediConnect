export type NotificationCategory =
  | "appointments"
  | "messages"
  | "reviews"
  | "availability"
  | "profile"
  | "system";
export type NotificationStatusFilter = "all" | "unread" | "read";
export type NotificationSortOrder = "newest" | "oldest";
export type NotificationPriority = "normal" | "attention";
export type NotificationPreviewAction = "mark-read" | "mark-unread" | "remove";

export interface DoctorNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  description: string;
  createdAt: string;
  isRead: boolean;
  priority: NotificationPriority;
  action?: {
    label: string;
    href: string;
  };
}

export interface NotificationFilters {
  search: string;
  category: "all" | NotificationCategory;
  status: NotificationStatusFilter;
  sort: NotificationSortOrder;
}

export interface NotificationMetricsData {
  total: number;
  unread: number;
  attention: number;
  thisWeek: number;
}

export interface NotificationsPageHeaderProps {
  unreadCount: number;
  onMarkAllRead: () => void;
}

export interface NotificationMetricsProps {
  metrics: NotificationMetricsData;
}

export interface NotificationFilterBarProps {
  filters: NotificationFilters;
  onChange: (changes: Partial<NotificationFilters>) => void;
  onReset: () => void;
  hasFilters: boolean;
}

export interface NotificationListProps {
  notifications: readonly DoctorNotification[];
  onPreviewAction: (
    notification: DoctorNotification,
    action: NotificationPreviewAction,
  ) => void;
  onResetFilters?: () => void;
}
