import { isAfter, subDays } from "date-fns";

import type {
  DoctorNotification,
  NotificationFilters,
  NotificationMetricsData,
} from "@/types/notification";

export function getFilteredNotifications(
  notifications: readonly DoctorNotification[],
  filters: NotificationFilters,
): DoctorNotification[] {
  const query = filters.search.trim().toLowerCase();

  return notifications
    .filter((notification) => {
      const matchesSearch =
        query === "" ||
        [notification.title, notification.description, notification.category].some(
          (value) => value.toLowerCase().includes(query),
        );
      const matchesCategory =
        filters.category === "all" ||
        notification.category === filters.category;
      const matchesStatus =
        filters.status === "all" ||
        (filters.status === "unread" ? !notification.isRead : notification.isRead);

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((first, second) => {
      const difference =
        new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();
      return filters.sort === "oldest" ? -difference : difference;
    });
}

export function getNotificationMetrics(
  notifications: readonly DoctorNotification[],
  now = new Date(),
): NotificationMetricsData {
  const weekStart = subDays(now, 7);

  return {
    total: notifications.length,
    unread: notifications.filter((notification) => !notification.isRead).length,
    attention: notifications.filter(
      (notification) => notification.priority === "attention",
    ).length,
    thisWeek: notifications.filter((notification) =>
      isAfter(new Date(notification.createdAt), weekStart),
    ).length,
  };
}
