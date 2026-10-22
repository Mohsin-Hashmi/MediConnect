import { format, isToday, isYesterday } from "date-fns";
import { MessageSquareText, Pin, Search } from "lucide-react";
import { cn } from "cn";

import { NoDataFound } from "@/components/common/no-data-found";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ConversationListProps } from "@/types/message";

function formatConversationTime(value: string): string {
  const date = new Date(value);
  if (isToday(date)) return format(date, "h:mm a");
  if (isYesterday(date)) return "Yesterday";
  return format(date, "d MMM");
}

export function ConversationList({
  conversations,
  selectedConversationId,
  search,
  filter,
  unreadCount,
  onSearchChange,
  onFilterChange,
  onSelect,
}: ConversationListProps) {
  return (
    <aside
      className="flex h-full min-h-0 flex-col border-r bg-white"
      aria-label="Conversations"
    >
      <div className="border-b p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">Inbox</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Appointment conversations
            </p>
          </div>
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MessageSquareText className="size-4.5" aria-hidden="true" />
          </span>
        </div>
        <div className="relative mt-4">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search conversations..."
            aria-label="Search conversations"
            className="h-10 bg-slate-50 pl-9"
          />
        </div>
        <div
          className="mt-3 grid grid-cols-2 rounded-lg bg-slate-100 p-1"
          aria-label="Conversation filters"
        >
          {(["all", "unread"] as const).map((value) => (
            <Button
              key={value}
              type="button"
              variant="ghost"
              className={cn(
                "h-8 cursor-pointer rounded-md px-3 text-xs capitalize hover:bg-white/80",
                filter === value &&
                  "bg-white font-semibold text-foreground shadow-sm hover:bg-white",
              )}
              aria-pressed={filter === value}
              onClick={() => onFilterChange(value)}
            >
              {value}
              {value === "unread" ? ` (${unreadCount})` : ""}
            </Button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {conversations.length > 0 ? (
          <ul>
            {conversations.map((conversation) => {
              const latestMessage = conversation.messages.at(-1);
              const selected = conversation.id === selectedConversationId;

              return (
                <li key={conversation.id}>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full cursor-pointer items-start gap-3 border-b px-4 py-3.5 text-left outline-none transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
                      selected && "bg-primary/7 hover:bg-primary/10",
                    )}
                    aria-current={selected ? "true" : undefined}
                    onClick={() => onSelect(conversation.id)}
                  >
                    <span className="relative shrink-0">
                      <Avatar className="size-10">
                        <AvatarFallback className="bg-blue-100 text-xs font-semibold text-blue-700">
                          {conversation.participant.initials}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.participant.isOnline ? (
                        <span
                          className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-white bg-emerald-500"
                          aria-label="Online"
                        />
                      ) : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            "truncate text-sm",
                            conversation.unreadCount > 0
                              ? "font-bold"
                              : "font-semibold",
                          )}
                        >
                          {conversation.participant.label}
                        </span>
                        <span className="shrink-0 text-[11px] text-muted-foreground">
                          {latestMessage
                            ? formatConversationTime(latestMessage.sentAt)
                            : ""}
                        </span>
                      </span>
                      <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        {conversation.isPinned ? (
                          <Pin
                            className="size-3 shrink-0 fill-current"
                            aria-label="Pinned conversation"
                          />
                        ) : null}
                        <span className="truncate">
                          {conversation.context.service}
                        </span>
                      </span>
                      <span className="mt-1 flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            "truncate text-xs",
                            conversation.unreadCount > 0
                              ? "font-medium text-slate-700"
                              : "text-muted-foreground",
                          )}
                        >
                          {latestMessage?.author === "doctor" ? "You: " : ""}
                          {latestMessage?.body ?? "No messages yet"}
                        </span>
                        {conversation.unreadCount > 0 ? (
                          <span
                            className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                            aria-label={`${conversation.unreadCount} unread messages`}
                          >
                            {conversation.unreadCount}
                          </span>
                        ) : null}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <NoDataFound
            title="No conversations found"
            description="Try another patient name, service, or inbox filter."
          />
        )}
      </div>
    </aside>
  );
}
