export type ConversationFilter = "all" | "unread";
export type MessageAuthor = "doctor" | "patient";
export type MessageDeliveryState = "sent" | "delivered" | "read";

export interface ChatMessage {
  id: string;
  author: MessageAuthor;
  body: string;
  sentAt: string;
  deliveryState?: MessageDeliveryState;
}

export interface ConversationParticipant {
  id: string;
  label: string;
  initials: string;
  isOnline: boolean;
  lastActiveAt?: string;
}

export interface ConversationContext {
  appointmentReference: string;
  service: string;
  consultationType: "in-person" | "video";
  appointmentDate: string;
  appointmentTime: string;
  totalConsultations: number;
}

export interface DoctorConversation {
  id: string;
  participant: ConversationParticipant;
  context: ConversationContext;
  unreadCount: number;
  isPinned: boolean;
  messages: ChatMessage[];
}

export interface MessagesPageHeaderProps {
  unreadCount: number;
}

export interface ConversationListProps {
  conversations: readonly DoctorConversation[];
  selectedConversationId: string;
  search: string;
  filter: ConversationFilter;
  unreadCount: number;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: ConversationFilter) => void;
  onSelect: (conversationId: string) => void;
}

export interface ConversationPanelProps {
  conversation: DoctorConversation;
  onBack: () => void;
  onSend: (message: string) => void;
  onAttach: () => void;
}

export interface PatientMessageContextProps {
  conversation: DoctorConversation;
}
