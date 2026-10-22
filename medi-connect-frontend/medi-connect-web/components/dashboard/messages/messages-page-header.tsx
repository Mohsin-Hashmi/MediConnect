import { MessageSquareText } from "lucide-react";

import { DashboardPageHeader } from "@/components/common/dashboard-page-header";
import { Badge } from "@/components/ui/badge";
import type { MessagesPageHeaderProps } from "@/types/message";

export function MessagesPageHeader({ unreadCount }: MessagesPageHeaderProps) {
  return (
    <DashboardPageHeader
      title="Messages"
      description="Keep appointment-related conversations organized in one workspace."
      actions={
        <Badge
          variant="outline"
          className="h-9 gap-2 rounded-lg bg-white px-3 text-muted-foreground"
        >
          <MessageSquareText className="size-4 text-primary" aria-hidden="true" />
          UI preview · {unreadCount} unread
        </Badge>
      }
    />
  );
}
