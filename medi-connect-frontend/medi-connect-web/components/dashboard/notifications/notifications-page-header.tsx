import { BellRing, CheckCheck } from "lucide-react";

import { DashboardPageHeader } from "@/components/common/dashboard-page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { NotificationsPageHeaderProps } from "@/types/notification";

export function NotificationsPageHeader({
  unreadCount,
  onMarkAllRead,
}: NotificationsPageHeaderProps) {
  return (
    <DashboardPageHeader
      title="Notifications"
      description="Review important activity across appointments, messages, feedback, and your practice."
      actions={
        <>
          <Badge
            variant="outline"
            className="h-10 gap-2 rounded-lg bg-white px-3 text-muted-foreground"
          >
            <BellRing className="size-4 text-primary" aria-hidden="true" />
            UI preview · {unreadCount} unread
          </Badge>
          <Button
            type="button"
            variant="outline"
            className="h-10 px-4"
            disabled={unreadCount === 0}
            onClick={onMarkAllRead}
          >
            <CheckCheck className="size-4" aria-hidden="true" />
            Mark all as read
          </Button>
        </>
      }
    />
  );
}
