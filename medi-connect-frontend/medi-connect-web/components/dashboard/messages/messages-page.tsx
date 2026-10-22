"use client";

import { useState } from "react";
import { cn } from "cn";
import { toast } from "sonner";

import { ConversationList } from "@/components/dashboard/messages/conversation-list";
import { ConversationPanel } from "@/components/dashboard/messages/conversation-panel";
import { MessagesPageHeader } from "@/components/dashboard/messages/messages-page-header";
import { PatientMessageContext } from "@/components/dashboard/messages/patient-message-context";
import { Card } from "@/components/ui/card";
import { DOCTOR_CONVERSATIONS_FIXTURE } from "@/data/mock/messages";
import {
  getFilteredConversations,
  getUnreadConversationCount,
} from "@/lib/messages";
import type { ConversationFilter } from "@/types/message";

export function MessagesPage() {
  const [selectedConversationId, setSelectedConversationId] = useState(
    DOCTOR_CONVERSATIONS_FIXTURE[0]?.id ?? "",
  );
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ConversationFilter>("all");
  const [mobileView, setMobileView] = useState<"list" | "conversation">("list");
  const unreadCount = getUnreadConversationCount(DOCTOR_CONVERSATIONS_FIXTURE);
  const conversations = getFilteredConversations(
    DOCTOR_CONVERSATIONS_FIXTURE,
    search,
    filter,
  );
  const selectedConversation =
    DOCTOR_CONVERSATIONS_FIXTURE.find(
      (conversation) => conversation.id === selectedConversationId,
    ) ?? DOCTOR_CONVERSATIONS_FIXTURE[0];

  function selectConversation(conversationId: string) {
    setSelectedConversationId(conversationId);
    setMobileView("conversation");
  }

  function showMessagingPreviewNotice() {
    toast.info(
      "Real-time messaging, delivery, and attachments will be enabled after the messaging API and Socket.IO contract are connected.",
    );
  }

  return (
    <section
      aria-label="Doctor messages"
      className="flex h-[calc(100svh-4.25rem)] min-h-0 w-full flex-none flex-col gap-5 overflow-hidden px-4 py-6 sm:px-5 lg:px-6 2xl:px-8"
    >
      <MessagesPageHeader unreadCount={unreadCount} />
      <Card className="min-h-0 flex-1 gap-0 overflow-hidden border-0 py-0 shadow-sm ring-1 ring-slate-200/90">
        <div className="grid h-full min-h-0 flex-1 md:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)_300px]">
          <div
            className={cn(
              "min-h-0",
              mobileView === "conversation" && "hidden md:block",
            )}
          >
            <ConversationList
              conversations={conversations}
              selectedConversationId={selectedConversationId}
              search={search}
              filter={filter}
              unreadCount={unreadCount}
              onSearchChange={setSearch}
              onFilterChange={setFilter}
              onSelect={selectConversation}
            />
          </div>
          {selectedConversation ? (
            <div
              className={cn(
                "min-h-0",
                mobileView === "list" && "hidden md:block",
              )}
            >
              <ConversationPanel
                key={selectedConversation.id}
                conversation={selectedConversation}
                onBack={() => setMobileView("list")}
                onSend={showMessagingPreviewNotice}
                onAttach={showMessagingPreviewNotice}
              />
            </div>
          ) : null}
          {selectedConversation ? (
            <div className="hidden min-h-0 xl:block">
              <PatientMessageContext conversation={selectedConversation} />
            </div>
          ) : null}
        </div>
      </Card>
    </section>
  );
}
