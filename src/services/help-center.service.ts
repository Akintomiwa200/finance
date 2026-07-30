import { db } from "@/src/lib/db";
import { pushRealtimeEvent } from "@/src/lib/realtime-bus";
import type {
  HelpCenterArticle,
  HelpCenterConversation,
  HelpCenterInboxItem,
  HelpCenterMessage,
  HelpCenterMessageRole,
  HelpCenterSession,
} from "@/src/types/help-center";

const DEFAULT_ARTICLES: Array<Omit<HelpCenterArticle, "id">> = [
  {
    slug: "reset-password",
    question: "How do I reset my password?",
    answer:
      "Go to Settings → Security → Reset Password. You'll receive a confirmation email within 5 minutes.",
    category: "account",
    sortOrder: 1,
  },
  {
    slug: "generate-report",
    question: "How to generate a report?",
    answer:
      "Navigate to Reports from the sidebar, choose your report type, set the date range, then click Generate. You can download as PDF or CSV.",
    category: "reports",
    sortOrder: 2,
  },
  {
    slug: "transactions-help",
    question: "I need help with transactions",
    answer:
      "View all transactions on the Transactions page. Use filters and search to find specific entries. For disputes, open a transaction and click Report Issue.",
    category: "transactions",
    sortOrder: 3,
  },
  {
    slug: "contact-admin",
    question: "Contact super admin",
    answer:
      "Your message has been sent to the super admin team. A support agent will respond here shortly.",
    category: "support",
    sortOrder: 4,
  },
];

let articlesSeeded = false;

function mapArticle(row: {
  id: string;
  slug: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
}): HelpCenterArticle {
  return {
    id: row.id,
    slug: row.slug,
    question: row.question,
    answer: row.answer,
    category: row.category,
    sortOrder: row.sortOrder,
  };
}

function mapMessage(row: {
  id: string;
  conversationId: string;
  role: HelpCenterMessageRole;
  content: string;
  authorId: string | null;
  authorName: string | null;
  createdAt: Date;
}): HelpCenterMessage {
  return {
    id: row.id,
    conversationId: row.conversationId,
    role: row.role,
    content: row.content,
    authorId: row.authorId,
    authorName: row.authorName,
    createdAt: row.createdAt.toISOString(),
  };
}

function mapConversation(row: {
  id: string;
  userId: string;
  organizationId: string;
  status: "OPEN" | "RESOLVED" | "CLOSED";
  subject: string;
  userName: string | null;
  userEmail: string | null;
  orgName: string | null;
  lastReadAt: Date | null;
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}): HelpCenterConversation {
  return {
    id: row.id,
    userId: row.userId,
    organizationId: row.organizationId,
    status: row.status,
    subject: row.subject,
    userName: row.userName,
    userEmail: row.userEmail,
    orgName: row.orgName,
    lastReadAt: row.lastReadAt?.toISOString() ?? null,
    lastMessageAt: row.lastMessageAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function ensureHelpCenterSeed() {
  if (articlesSeeded) return;

  const count = await db.helpCenterArticle.count();
  if (count === 0) {
    await db.helpCenterArticle.createMany({
      data: DEFAULT_ARTICLES,
    });
  }

  articlesSeeded = true;
}

export async function getHelpCenterArticles(): Promise<HelpCenterArticle[]> {
  await ensureHelpCenterSeed();
  const rows = await db.helpCenterArticle.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { question: "asc" }],
  });
  return rows.map(mapArticle);
}

async function findMatchingArticle(content: string): Promise<HelpCenterArticle | null> {
  const articles = await getHelpCenterArticles();
  const normalized = content.trim().toLowerCase();

  return (
    articles.find((article) => article.question.trim().toLowerCase() === normalized) ??
    articles.find((article) => normalized.includes(article.question.toLowerCase().slice(0, 24))) ??
    null
  );
}

async function countUnreadMessages(
  conversationId: string,
  lastReadAt: Date | null,
): Promise<number> {
  return db.helpCenterMessage.count({
    where: {
      conversationId,
      role: { in: ["STAFF", "BOT"] },
      ...(lastReadAt ? { createdAt: { gt: lastReadAt } } : {}),
    },
  });
}

async function getLastMessage(conversationId: string): Promise<HelpCenterMessage | null> {
  const row = await db.helpCenterMessage.findFirst({
    where: { conversationId },
    orderBy: { createdAt: "desc" },
  });
  return row ? mapMessage(row) : null;
}

export async function getOrCreateUserConversation(input: {
  userId: string;
  organizationId: string;
  userName: string;
  userEmail?: string | null;
  orgName: string;
}): Promise<HelpCenterConversation> {
  const existing = await db.helpCenterConversation.findFirst({
    where: { userId: input.userId, status: "OPEN" },
    orderBy: { updatedAt: "desc" },
  });

  if (existing) {
    return mapConversation(existing);
  }

  const created = await db.helpCenterConversation.create({
    data: {
      userId: input.userId,
      organizationId: input.organizationId,
      userName: input.userName,
      userEmail: input.userEmail ?? null,
      orgName: input.orgName,
      status: "OPEN",
      subject: "Help Center",
    },
  });

  await createHelpCenterMessage({
    conversationId: created.id,
    role: "SYSTEM",
    content: "Welcome to Audpay Help! How can we assist you today?",
    authorName: "Help Center",
    notify: false,
  });

  pushRealtimeEvent({
    entity: "help_center_conversation",
    event: "create",
    data: mapConversation(created),
    userId: input.userId,
  });

  return mapConversation(created);
}

export async function createHelpCenterMessage(input: {
  conversationId: string;
  role: HelpCenterMessageRole;
  content: string;
  authorId?: string | null;
  authorName?: string | null;
  notify?: boolean;
}): Promise<HelpCenterMessage> {
  const message = await db.helpCenterMessage.create({
    data: {
      conversationId: input.conversationId,
      role: input.role,
      content: input.content,
      authorId: input.authorId ?? null,
      authorName: input.authorName ?? null,
    },
  });

  await db.helpCenterConversation.update({
    where: { id: input.conversationId },
    data: { lastMessageAt: message.createdAt },
  });

  const mapped = mapMessage(message);

  if (input.notify !== false) {
    pushRealtimeEvent({
      entity: "help_center_message",
      event: "create",
      data: mapped,
    });
    pushRealtimeEvent({
      entity: "help_center_conversation",
      event: "update",
      data: { id: input.conversationId, lastMessageAt: mapped.createdAt },
    });
  }

  return mapped;
}

async function maybeAutoReply(conversationId: string, userContent: string) {
  const matched = await findMatchingArticle(userContent);

  if (matched) {
    await createHelpCenterMessage({
      conversationId,
      role: "BOT",
      content: matched.answer,
      authorName: "Help Assistant",
    });
    return;
  }

  await createHelpCenterMessage({
    conversationId,
    role: "BOT",
    content:
      "Thanks for reaching out! Our support team will respond within 24 hours. For urgent issues, open a ticket from Support in the sidebar.",
    authorName: "Help Assistant",
  });
}

export async function sendUserHelpCenterMessage(input: {
  userId: string;
  organizationId: string;
  userName: string;
  userEmail?: string | null;
  orgName: string;
  content: string;
}): Promise<{ message: HelpCenterMessage; conversation: HelpCenterConversation }> {
  const conversation = await getOrCreateUserConversation(input);

  const message = await createHelpCenterMessage({
    conversationId: conversation.id,
    role: "USER",
    content: input.content.trim(),
    authorId: input.userId,
    authorName: input.userName,
  });

  await maybeAutoReply(conversation.id, input.content);

  const refreshed = await db.helpCenterConversation.findUnique({
    where: { id: conversation.id },
  });

  return {
    message,
    conversation: mapConversation(refreshed!),
  };
}

export async function getUserHelpCenterSession(input: {
  userId: string;
  organizationId: string;
  userName: string;
  userEmail?: string | null;
  orgName: string;
}): Promise<HelpCenterSession> {
  await ensureHelpCenterSeed();

  const conversation = await getOrCreateUserConversation(input);
  const [messages, articles, unreadCount] = await Promise.all([
    db.helpCenterMessage.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "asc" },
    }),
    getHelpCenterArticles(),
    countUnreadMessages(
      conversation.id,
      conversation.lastReadAt ? new Date(conversation.lastReadAt) : null,
    ),
  ]);

  return {
    conversation,
    messages: messages.map(mapMessage),
    articles,
    unreadCount,
  };
}

export async function markHelpCenterRead(conversationId: string, userId: string) {
  const conversation = await db.helpCenterConversation.findFirst({
    where: { id: conversationId, userId },
  });

  if (!conversation) return null;

  const updated = await db.helpCenterConversation.update({
    where: { id: conversationId },
    data: { lastReadAt: new Date() },
  });

  pushRealtimeEvent({
    entity: "help_center_conversation",
    event: "update",
    data: { id: conversationId, lastReadAt: updated.lastReadAt?.toISOString() },
    userId,
  });

  return mapConversation(updated);
}

export async function getHelpCenterUnreadCount(userId: string): Promise<number> {
  const conversation = await db.helpCenterConversation.findFirst({
    where: { userId, status: "OPEN" },
    orderBy: { updatedAt: "desc" },
  });

  if (!conversation) return 0;

  return countUnreadMessages(conversation.id, conversation.lastReadAt);
}

export async function getAdminHelpCenterInbox(): Promise<HelpCenterInboxItem[]> {
  const conversations = await db.helpCenterConversation.findMany({
    where: { status: "OPEN" },
    orderBy: { lastMessageAt: "desc" },
    take: 50,
  });

  const items = await Promise.all(
    conversations.map(async (conversation) => {
      const lastStaff = await db.helpCenterMessage.findFirst({
        where: { conversationId: conversation.id, role: "STAFF" },
        orderBy: { createdAt: "desc" },
      });

      const unreadCount = await db.helpCenterMessage.count({
        where: {
          conversationId: conversation.id,
          role: "USER",
          ...(lastStaff ? { createdAt: { gt: lastStaff.createdAt } } : {}),
        },
      });

      const lastMessage = await getLastMessage(conversation.id);

      return {
        ...mapConversation(conversation),
        unreadCount,
        lastMessage,
      };
    }),
  );

  return items;
}

export async function getAdminHelpCenterConversation(
  conversationId: string,
): Promise<HelpCenterSession | null> {
  await ensureHelpCenterSeed();

  const conversation = await db.helpCenterConversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) return null;

  const [messages, articles] = await Promise.all([
    db.helpCenterMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    }),
    getHelpCenterArticles(),
  ]);

  return {
    conversation: mapConversation(conversation),
    messages: messages.map(mapMessage),
    articles,
    unreadCount: 0,
  };
}

export async function sendStaffHelpCenterMessage(input: {
  conversationId: string;
  staffId: string;
  staffName: string;
  content: string;
}): Promise<HelpCenterMessage> {
  const conversation = await db.helpCenterConversation.findUnique({
    where: { id: input.conversationId },
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  return createHelpCenterMessage({
    conversationId: input.conversationId,
    role: "STAFF",
    content: input.content.trim(),
    authorId: input.staffId,
    authorName: input.staffName,
  });
}

export async function resolveHelpCenterConversation(conversationId: string) {
  const updated = await db.helpCenterConversation.update({
    where: { id: conversationId },
    data: { status: "RESOLVED" },
  });

  pushRealtimeEvent({
    entity: "help_center_conversation",
    event: "update",
    data: mapConversation(updated),
  });

  return mapConversation(updated);
}
