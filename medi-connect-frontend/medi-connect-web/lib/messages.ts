import type { ConversationFilter, DoctorConversation } from "@/types/message";

function getLatestMessageTimestamp(conversation: DoctorConversation): number {
  const latestMessage = conversation.messages.at(-1);
  return latestMessage ? new Date(latestMessage.sentAt).getTime() : 0;
}

export function getFilteredConversations(
  conversations: readonly DoctorConversation[],
  search: string,
  filter: ConversationFilter,
): DoctorConversation[] {
  const query = search.trim().toLowerCase();

  return conversations
    .filter((conversation) => {
      const latestMessage = conversation.messages.at(-1)?.body ?? "";
      const matchesSearch =
        query === "" ||
        [conversation.participant.label, conversation.context.service, latestMessage].some(
          (value) => value.toLowerCase().includes(query),
        );
      const matchesFilter = filter === "all" || conversation.unreadCount > 0;
      return matchesSearch && matchesFilter;
    })
    .sort(
      (first, second) =>
        Number(second.isPinned) - Number(first.isPinned) ||
        getLatestMessageTimestamp(second) - getLatestMessageTimestamp(first),
    );
}

export function getUnreadConversationCount(
  conversations: readonly DoctorConversation[],
): number {
  return conversations.filter((conversation) => conversation.unreadCount > 0).length;
}
