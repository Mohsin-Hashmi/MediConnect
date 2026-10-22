import Link from "next/link";
import { format, isToday, isYesterday } from "date-fns";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  Mail,
  MessageSquareText,
  MoreVertical,
  ShieldCheck,
  Star,
  Trash2,
  UserRound,
} from "lucide-react";
import { cn } from "cn";

import { NoDataFound } from "@/components/common/no-data-found";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  DoctorNotification,
  NotificationCategory,
  NotificationListProps,
} from "@/types/notification";

const categoryStyles: Record<
  NotificationCategory,
  { label: string; icon: LucideIcon; tone: string }
> = {
  appointments: {
    label: "Appointment",
    icon: CalendarDays,
    tone: "bg-blue-50 text-blue-600",
  },
  messages: {
    label: "Message",
    icon: MessageSquareText,
    tone: "bg-violet-50 text-violet-600",
  },
  reviews: {
    label: "Review",
    icon: Star,
    tone: "bg-amber-50 text-amber-600",
  },
  availability: {
    label: "Availability",
    icon: Clock3,
    tone: "bg-emerald-50 text-emerald-600",
  },
  profile: {
    label: "Profile",
    icon: UserRound,
    tone: "bg-cyan-50 text-cyan-700",
  },
  system: {
    label: "System",
    icon: ShieldCheck,
    tone: "bg-slate-100 text-slate-600",
  },
};

function getRelativeDateLabel(value: string): string {
  const date = new Date(value);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "d MMM yyyy");
}

export function NotificationList({
  notifications,
  onPreviewAction,
  onResetFilters,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <NoDataFound
        title="No notifications found"
        description={
          onResetFilters
            ? "Try another search or clear the current filters."
            : "Important doctor workspace activity will appear here."
        }
        actionLabel={onResetFilters ? "Clear filters" : undefined}
        onAction={onResetFilters}
      />
    );
  }

  function renderActionMenu(notification: DoctorNotification) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9"
              aria-label={`Actions for ${notification.title}`}
            />
          }
        >
          <MoreVertical className="size-4" aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40 p-1.5">
          <DropdownMenuItem
            className="min-h-9 gap-2 px-2.5"
            onClick={() =>
              onPreviewAction(
                notification,
                notification.isRead ? "mark-unread" : "mark-read",
              )
            }
          >
            {notification.isRead ? (
              <Mail className="size-4" aria-hidden="true" />
            ) : (
              <Check className="size-4" aria-hidden="true" />
            )}
            Mark as {notification.isRead ? "unread" : "read"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="min-h-9 gap-2 px-2.5"
            onClick={() => onPreviewAction(notification, "remove")}
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div aria-label="Notification activity">
      <div className="hidden xl:block">
        <Table>
          <TableHeader className="bg-slate-50/90">
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-5 text-xs tracking-wide text-muted-foreground uppercase">
                Notification
              </TableHead>
              <TableHead className="text-xs tracking-wide text-muted-foreground uppercase">
                Category
              </TableHead>
              <TableHead className="text-xs tracking-wide text-muted-foreground uppercase">
                Received
              </TableHead>
              <TableHead className="text-xs tracking-wide text-muted-foreground uppercase">
                Status
              </TableHead>
              <TableHead className="text-xs tracking-wide text-muted-foreground uppercase">
                Destination
              </TableHead>
              <TableHead className="pr-5 text-right text-xs tracking-wide text-muted-foreground uppercase">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((notification) => {
              const category = categoryStyles[notification.category];
              const CategoryIcon = category.icon;

              return (
                <TableRow
                  key={notification.id}
                  className={cn(
                    "group",
                    !notification.isRead && "bg-blue-50/35",
                  )}
                  aria-label={`${notification.isRead ? "Read" : "Unread"}: ${notification.title}`}
                >
                  <TableCell className="min-w-96 py-3.5 pl-5 whitespace-normal">
                    <div className="flex min-w-0 items-start gap-3">
                      <span
                        className={cn(
                          "relative flex size-10 shrink-0 items-center justify-center rounded-xl",
                          category.tone,
                        )}
                      >
                        {!notification.isRead ? (
                          <span
                            className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full border-2 border-white bg-primary"
                            aria-hidden="true"
                          />
                        ) : null}
                        <CategoryIcon className="size-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p
                          className={cn(
                            "text-sm text-foreground",
                            notification.isRead ? "font-semibold" : "font-bold",
                          )}
                        >
                          {notification.title}
                        </p>
                        <p className="mt-1 line-clamp-2 max-w-2xl text-sm leading-5 text-muted-foreground">
                          {notification.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-white font-normal">
                      {category.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <time
                      dateTime={notification.createdAt}
                      className="block whitespace-nowrap"
                    >
                      <span className="block font-medium text-foreground">
                        {getRelativeDateLabel(notification.createdAt)}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {format(new Date(notification.createdAt), "h:mm a")}
                      </span>
                    </time>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-start gap-1.5">
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-medium",
                          notification.isRead
                            ? "bg-slate-50 text-slate-600"
                            : "border-blue-200 bg-blue-50 text-blue-700",
                        )}
                      >
                        {notification.isRead ? "Read" : "Unread"}
                      </Badge>
                      {notification.priority === "attention" ? (
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                          Needs attention
                        </Badge>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    {notification.action ? (
                      <Button
                        render={<Link href={notification.action.href} />}
                        nativeButton={false}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 whitespace-nowrap"
                      >
                        {notification.action.label}
                        <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      </Button>
                    ) : (
                      <span className="text-sm text-muted-foreground">No link</span>
                    )}
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    {renderActionMenu(notification)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="divide-y xl:hidden">
        {notifications.map((notification) => {
          const category = categoryStyles[notification.category];
          const CategoryIcon = category.icon;

          return (
            <article
              key={notification.id}
              className={cn(
                "space-y-3 px-5 py-4",
                !notification.isRead && "bg-blue-50/35",
              )}
              aria-label={`${notification.isRead ? "Read" : "Unread"}: ${notification.title}`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "relative flex size-10 shrink-0 items-center justify-center rounded-xl",
                    category.tone,
                  )}
                >
                  {!notification.isRead ? (
                    <span
                      className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full border-2 border-white bg-primary"
                      aria-hidden="true"
                    />
                  ) : null}
                  <CategoryIcon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className={cn(
                        "text-sm text-foreground",
                        notification.isRead ? "font-semibold" : "font-bold",
                      )}
                    >
                      {notification.title}
                    </h3>
                    {renderActionMenu(notification)}
                  </div>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    {notification.description}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 pl-13">
                <Badge variant="outline" className="bg-white font-normal">
                  {category.label}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    notification.isRead
                      ? "bg-slate-50 text-slate-600"
                      : "border-blue-200 bg-blue-50 text-blue-700",
                  )}
                >
                  {notification.isRead ? "Read" : "Unread"}
                </Badge>
                {notification.priority === "attention" ? (
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                    Needs attention
                  </Badge>
                ) : null}
                <time
                  dateTime={notification.createdAt}
                  className="text-xs text-muted-foreground"
                >
                  {getRelativeDateLabel(notification.createdAt)} ·{" "}
                  {format(new Date(notification.createdAt), "h:mm a")}
                </time>
              </div>
              {notification.action ? (
                <div className="pl-13">
                  <Button
                    render={<Link href={notification.action.href} />}
                    nativeButton={false}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8"
                  >
                    {notification.action.label}
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </Button>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
