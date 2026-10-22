"use client";

import { useState } from "react";
import { toast } from "sonner";

import { DataSectionHeader } from "@/components/common/data-section-header";
import { Pagination } from "@/components/common/pagination";
import { NotificationFilters } from "@/components/dashboard/notifications/notification-filters";
import { NotificationList } from "@/components/dashboard/notifications/notification-list";
import { NotificationSummary } from "@/components/dashboard/notifications/notification-summary";
import { NotificationsPageHeader } from "@/components/dashboard/notifications/notifications-page-header";
import { Card, CardContent } from "@/components/ui/card";
import { PAGINATION_PAGE_SIZE } from "@/constants/pagination";
import { DOCTOR_NOTIFICATIONS_FIXTURE } from "@/data/mock/notifications";
import {
  getFilteredNotifications,
  getNotificationMetrics,
} from "@/lib/notifications";
import type {
  DoctorNotification,
  NotificationFilters as NotificationFilterValues,
  NotificationPreviewAction,
} from "@/types/notification";

const initialFilters: NotificationFilterValues = {
  search: "",
  category: "all",
  status: "all",
  sort: "newest",
};

export function NotificationsPage() {
  const [filters, setFilters] =
    useState<NotificationFilterValues>(initialFilters);
  const [page, setPage] = useState(1);
  const filtered = getFilteredNotifications(
    DOCTOR_NOTIFICATIONS_FIXTURE,
    filters,
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGINATION_PAGE_SIZE),
  );
  const currentPage = Math.min(page, totalPages);
  const visibleNotifications = filtered.slice(
    (currentPage - 1) * PAGINATION_PAGE_SIZE,
    currentPage * PAGINATION_PAGE_SIZE,
  );
  const metrics = getNotificationMetrics(DOCTOR_NOTIFICATIONS_FIXTURE);
  const hasFilters =
    filters.search !== "" ||
    filters.category !== "all" ||
    filters.status !== "all";

  function updateFilters(changes: Partial<NotificationFilterValues>) {
    setFilters((previous) => ({ ...previous, ...changes }));
    setPage(1);
  }

  function resetFilters() {
    setFilters(initialFilters);
    setPage(1);
  }

  function showPreviewAction(
    _notification: DoctorNotification,
    action: NotificationPreviewAction,
  ) {
    const actionLabel =
      action === "remove"
        ? "Removing notifications"
        : action === "mark-read"
          ? "Updating read status"
          : "Updating unread status";
    toast.info(
      `${actionLabel} will be available after the notifications API is connected.`,
    );
  }

  function showMarkAllPreview() {
    toast.info(
      "Mark all as read will be available after the notifications API is connected.",
    );
  }

  return (
    <section
      aria-label="Doctor notifications"
      className="w-full flex-1 space-y-5 px-4 py-6 sm:px-5 lg:px-6 2xl:px-8"
    >
      <NotificationsPageHeader
        unreadCount={metrics.unread}
        onMarkAllRead={showMarkAllPreview}
      />
      <NotificationSummary metrics={metrics} />

      <Card className="min-w-0 gap-0 border-0 py-0 shadow-sm ring-1 ring-slate-200/90">
        <DataSectionHeader
          title="Notification history"
          description="Review, filter, and open system-generated updates from across your doctor workspace."
          countLabel={`${filtered.length} matching notifications`}
        />
        <CardContent className="px-0">
          <NotificationFilters
            filters={filters}
            onChange={updateFilters}
            onReset={resetFilters}
            hasFilters={hasFilters}
          />
          <p className="sr-only" role="status" aria-atomic="true">
            {filtered.length} notifications match the current filters.
          </p>
          <NotificationList
            notifications={visibleNotifications}
            onPreviewAction={showPreviewAction}
            onResetFilters={hasFilters ? resetFilters : undefined}
          />
          <Pagination
            currentPage={currentPage}
            totalItems={filtered.length}
            onPageChange={setPage}
            itemLabel="notifications"
          />
        </CardContent>
      </Card>
    </section>
  );
}
