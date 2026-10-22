"use client";

import { useState, type KeyboardEvent } from "react";
import { format, isSameDay } from "date-fns";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  MoreHorizontal,
  Paperclip,
  SendHorizontal,
} from "lucide-react";
import { cn } from "cn";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import type { ConversationPanelProps } from "@/types/message";

export function ConversationPanel({
  conversation,
  onBack,
  onSend,
  onAttach,
}: ConversationPanelProps) {
  const [draft, setDraft] = useState("");
  const { participant } = conversation;
  const presence = participant.isOnline
    ? "Online"
    : participant.lastActiveAt
      ? `Last active ${format(new Date(participant.lastActiveAt), "d MMM, h:mm a")}`
      : "Offline";

  function submitDraft() {
    const message = draft.trim();
    if (message) onSend(message);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitDraft();
    }
  }

  return (
    <section
      className="flex h-full min-h-0 flex-col bg-white"
      aria-label={`Conversation with ${participant.label}`}
    >
      <header className="flex min-h-18 items-center justify-between gap-3 border-b px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 cursor-pointer md:hidden"
            onClick={onBack}
            aria-label="Back to conversations"
          >
            <ArrowLeft className="size-4.5" aria-hidden="true" />
          </Button>
          <span className="relative shrink-0">
            <Avatar className="size-10">
              <AvatarFallback className="bg-blue-100 text-xs font-semibold text-blue-700">
                {participant.initials}
              </AvatarFallback>
            </Avatar>
            {participant.isOnline ? (
              <span
                className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-white bg-emerald-500"
                aria-hidden="true"
              />
            ) : null}
          </span>
          <div className="min-w-0">
            <h2 className="truncate font-semibold">{participant.label}</h2>
            <p className="truncate text-xs text-muted-foreground">{presence}</p>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 cursor-pointer"
          aria-label="Conversation options"
          onClick={onAttach}
        >
          <MoreHorizontal className="size-5" aria-hidden="true" />
        </Button>
      </header>

      <div
        className="min-h-0 flex-1 overflow-y-auto bg-slate-50/70 px-4 py-5 sm:px-6"
        role="log"
        aria-label={`Message history with ${participant.label}`}
        aria-live="polite"
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          {conversation.messages.map((message, index) => {
            const previousMessage = conversation.messages[index - 1];
            const showDate =
              !previousMessage ||
              !isSameDay(
                new Date(previousMessage.sentAt),
                new Date(message.sentAt),
              );
            const isDoctor = message.author === "doctor";
            const DeliveryIcon =
              message.deliveryState === "sent" ? Check : CheckCheck;

            return (
              <div key={message.id}>
                {showDate ? (
                  <div
                    className="my-3 flex items-center gap-3"
                    aria-label={format(
                      new Date(message.sentAt),
                      "EEEE, d MMMM yyyy",
                    )}
                  >
                    <span className="h-px flex-1 bg-slate-200" />
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {format(new Date(message.sentAt), "d MMM yyyy")}
                    </span>
                    <span className="h-px flex-1 bg-slate-200" />
                  </div>
                ) : null}
                <article
                  className={cn(
                    "flex",
                    isDoctor ? "justify-end" : "justify-start",
                  )}
                  aria-label={`${isDoctor ? "You" : participant.label} at ${format(new Date(message.sentAt), "h:mm a")}`}
                >
                  <div
                    className={cn(
                      "max-w-[86%] rounded-2xl px-3.5 py-2.5 shadow-sm sm:max-w-[72%]",
                      isDoctor
                        ? "rounded-br-md bg-primary text-primary-foreground"
                        : "rounded-bl-md bg-white text-slate-800 ring-1 ring-slate-200",
                    )}
                  >
                    <p className="text-sm leading-5">{message.body}</p>
                    <div
                      className={cn(
                        "mt-1 flex items-center justify-end gap-1 text-[10px]",
                        isDoctor
                          ? "text-primary-foreground/75"
                          : "text-muted-foreground",
                      )}
                    >
                      <time dateTime={message.sentAt}>
                        {format(new Date(message.sentAt), "h:mm a")}
                      </time>
                      {isDoctor && message.deliveryState ? (
                        <DeliveryIcon
                          className={cn(
                            "size-3",
                            message.deliveryState === "read" && "text-blue-200",
                          )}
                          aria-label={message.deliveryState}
                        />
                      ) : null}
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t bg-white p-4">
        <form
          className="mx-auto max-w-3xl"
          onSubmit={(event) => {
            event.preventDefault();
            submitDraft();
          }}
        >
          <InputGroup className="min-h-12 items-end bg-white shadow-sm">
            <InputGroupAddon align="inline-start" className="pb-2">
              <InputGroupButton
                type="button"
                size="icon-sm"
                aria-label="Attach a file"
                onClick={onAttach}
                className="cursor-pointer"
              >
                <Paperclip className="size-4" aria-hidden="true" />
              </InputGroupButton>
            </InputGroupAddon>
            <InputGroupTextarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              maxLength={1000}
              aria-label={`Message ${participant.label}`}
              aria-describedby="message-preview-note"
              placeholder={`Message ${participant.label}...`}
              className="max-h-32 min-h-11 py-3"
            />
            <InputGroupAddon align="inline-end" className="pb-2">
              <Button
                type="submit"
                size="icon"
                disabled={draft.trim() === ""}
                aria-label="Send message"
                className="size-8 cursor-pointer rounded-md disabled:cursor-not-allowed"
              >
                <SendHorizontal className="size-4" aria-hidden="true" />
              </Button>
            </InputGroupAddon>
          </InputGroup>
          <div
            id="message-preview-note"
            className="mt-2 flex items-center justify-between gap-3 text-[11px] text-muted-foreground"
          >
            <span>Preview only — messages and attachments are not sent.</span>
            <span className="hidden sm:inline">
              Enter to send · Shift + Enter for a new line
            </span>
          </div>
        </form>
      </div>
    </section>
  );
}
