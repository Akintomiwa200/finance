export type HelpCenterMessageRole = "USER" | "STAFF" | "SYSTEM" | "BOT";

export type HelpCenterConversationStatus = "OPEN" | "RESOLVED" | "CLOSED";

export interface HelpCenterArticle {
  id: string;
  slug: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
}

export interface HelpCenterMessage {
  id: string;
  conversationId: string;
  role: HelpCenterMessageRole;
  content: string;
  authorId: string | null;
  authorName: string | null;
  createdAt: string;
}

export interface HelpCenterConversation {
  id: string;
  userId: string;
  organizationId: string;
  status: HelpCenterConversationStatus;
  subject: string;
  userName: string | null;
  userEmail: string | null;
  orgName: string | null;
  lastReadAt: string | null;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
  unreadCount?: number;
  lastMessage?: HelpCenterMessage | null;
}

export interface HelpCenterInboxItem extends HelpCenterConversation {
  unreadCount: number;
  lastMessage: HelpCenterMessage | null;
}

export interface HelpCenterSession {
  conversation: HelpCenterConversation;
  messages: HelpCenterMessage[];
  articles: HelpCenterArticle[];
  unreadCount: number;
}
