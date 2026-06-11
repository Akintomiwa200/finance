import type {
  SupportTicket,
  SupportComment,
  LiveFixSession,
  LiveFixChatMessage,
  LiveFixSessionState,
} from "@/src/types/admin";
import { generateId } from "@/src/lib/utils";

const tickets: SupportTicket[] = [
  {
    id: "tkt_001",
    title: "Payment gateway integration failing",
    description: "Our payment gateway returns 502 errors when processing vendor bills.",
    status: "IN_PROGRESS",
    priority: "HIGH",
    organizationId: "org_1",
    organizationName: "Acme Corp",
    createdByName: "John Doe",
    assignedToName: "Support Team",
    githubIssueUrl: "https://github.com/faas-platform/finance/issues/42",
    jiraIssueKey: "FAAS-128",
    commentCount: 3,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "tkt_002",
    title: "Cannot export payroll reports",
    description: "PDF export button is unresponsive on the payroll reports page.",
    status: "OPEN",
    priority: "MEDIUM",
    organizationId: "org_2",
    organizationName: "Beta Corp",
    createdByName: "Sarah Jones",
    assignedToName: null,
    githubIssueUrl: null,
    jiraIssueKey: null,
    commentCount: 1,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "tkt_003",
    title: "Request live-fix session for ledger mismatch",
    description: "Trial balance does not match journal entries. Need remote assistance.",
    status: "OPEN",
    priority: "URGENT",
    organizationId: "org_3",
    organizationName: "Gamma Ltd",
    createdByName: "Mike Ross",
    assignedToName: null,
    githubIssueUrl: null,
    jiraIssueKey: "FAAS-131",
    commentCount: 0,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
];

const comments: SupportComment[] = [
  {
    id: "cmt_001",
    ticketId: "tkt_001",
    content: "We are investigating the gateway timeout issue.",
    authorName: "Support Team",
    isStaff: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "cmt_002",
    ticketId: "tkt_001",
    content: "Can you share the error logs from the last failed transaction?",
    authorName: "Support Team",
    isStaff: true,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "cmt_003",
    ticketId: "tkt_001",
    content: "Attached logs from yesterday's failed batch run.",
    authorName: "John Doe",
    isStaff: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
];

const liveFixSessions: LiveFixSession[] = [
  {
    id: "lfx_001",
    ticketId: "tkt_003",
    organizationId: "org_3",
    organizationName: "Gamma Ltd",
    status: "active",
    sessionCode: "FX-4829",
    requestedBy: "Mike Ross",
    startedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

const liveFixChatMessages: LiveFixChatMessage[] = [
  {
    id: "lfx_chat_001",
    sessionId: "lfx_001",
    author: "admin",
    authorName: "Support Agent",
    content: "Hello! I'm connected. What issue are you seeing?",
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
];

const liveFixSessionStates = new Map<string, LiveFixSessionState>();

function defaultSessionState(sessionId: string): LiveFixSessionState {
  return {
    sessionId,
    isSharing: false,
    isMuted: false,
    isVideoOff: false,
    remoteControlRequested: false,
    remoteControlGranted: false,
    activeRemoteTool: null,
    updatedAt: new Date().toISOString(),
  };
}

export function remapOrganizationId(mockId: string, realId: string) {
  for (const ticket of tickets) {
    if (ticket.organizationId === mockId) {
      ticket.organizationId = realId;
    }
  }
  for (const session of liveFixSessions) {
    if (session.organizationId === mockId) {
      session.organizationId = realId;
    }
  }
}

export function getSupportTickets(organizationId?: string): SupportTicket[] {
  const list = [...tickets];
  if (organizationId) {
    return list.filter((t) => t.organizationId === organizationId);
  }
  return list;
}

export function createSupportTicket(
  data: Omit<SupportTicket, "id" | "commentCount" | "createdAt" | "updatedAt">,
): SupportTicket {
  const ticket: SupportTicket = {
    ...data,
    id: generateId("tkt_"),
    commentCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tickets.unshift(ticket);
  return ticket;
}

export function getSupportTicket(id: string): SupportTicket | undefined {
  return tickets.find((t) => t.id === id);
}

export function getTicketComments(ticketId: string): SupportComment[] {
  return comments.filter((c) => c.ticketId === ticketId);
}

export function addTicketComment(
  ticketId: string,
  content: string,
  authorName: string,
  isStaff = false,
): SupportComment {
  const comment: SupportComment = {
    id: generateId("cmt_"),
    ticketId,
    content,
    authorName,
    isStaff,
    createdAt: new Date().toISOString(),
  };
  comments.push(comment);

  const ticket = tickets.find((t) => t.id === ticketId);
  if (ticket) {
    ticket.commentCount += 1;
    ticket.updatedAt = new Date().toISOString();
  }

  return comment;
}

export function updateTicketStatus(
  id: string,
  status: SupportTicket["status"],
): SupportTicket | undefined {
  const ticket = tickets.find((t) => t.id === id);
  if (ticket) {
    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();
  }
  return ticket;
}

export function updateTicketPriority(
  id: string,
  priority: SupportTicket["priority"],
): SupportTicket | undefined {
  const ticket = tickets.find((t) => t.id === id);
  if (ticket) {
    ticket.priority = priority;
    ticket.updatedAt = new Date().toISOString();
  }
  return ticket;
}

export function updateTicketAssignment(
  id: string,
  assignedToName: string | null,
): SupportTicket | undefined {
  const ticket = tickets.find((t) => t.id === id);
  if (ticket) {
    ticket.assignedToName = assignedToName;
    ticket.updatedAt = new Date().toISOString();
  }
  return ticket;
}

export function updateTicketGithubIssue(
  id: string,
  githubIssueUrl: string | null,
): SupportTicket | undefined {
  const ticket = tickets.find((t) => t.id === id);
  if (ticket) {
    ticket.githubIssueUrl = githubIssueUrl;
    ticket.updatedAt = new Date().toISOString();
  }
  return ticket;
}

export function updateTicketJiraIssue(
  id: string,
  jiraIssueKey: string | null,
): SupportTicket | undefined {
  const ticket = tickets.find((t) => t.id === id);
  if (ticket) {
    ticket.jiraIssueKey = jiraIssueKey;
    ticket.updatedAt = new Date().toISOString();
  }
  return ticket;
}

export function getLiveFixSessions(organizationId?: string): LiveFixSession[] {
  const list = [...liveFixSessions];
  if (organizationId) {
    return list.filter((s) => s.organizationId === organizationId);
  }
  return list;
}

export function getLiveFixSession(id: string): LiveFixSession | undefined {
  return liveFixSessions.find((s) => s.id === id);
}

export function createLiveFixSession(data: {
  ticketId?: string;
  organizationId?: string;
  organizationName: string;
  requestedBy: string;
}): LiveFixSession {
  const session: LiveFixSession = {
    id: generateId("lfx_"),
    ticketId: data.ticketId ?? null,
    organizationId: data.organizationId,
    organizationName: data.organizationName,
    status: "waiting",
    sessionCode: `FX-${Math.floor(1000 + Math.random() * 9000)}`,
    requestedBy: data.requestedBy,
    startedAt: null,
    createdAt: new Date().toISOString(),
  };
  liveFixSessions.unshift(session);
  return session;
}

export function startLiveFixSession(id: string): LiveFixSession | undefined {
  const session = liveFixSessions.find((s) => s.id === id);
  if (session) {
    session.status = "active";
    session.startedAt = new Date().toISOString();
  }
  return session;
}

export function endLiveFixSession(id: string): LiveFixSession | undefined {
  const session = liveFixSessions.find((s) => s.id === id);
  if (session) {
    session.status = "ended";
    session.endedAt = new Date().toISOString();
  }
  return session;
}

export function getLiveFixChatMessages(sessionId: string): LiveFixChatMessage[] {
  return liveFixChatMessages
    .filter((m) => m.sessionId === sessionId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function addLiveFixChatMessage(data: {
  sessionId: string;
  author: LiveFixChatMessage["author"];
  authorName: string;
  content: string;
}): LiveFixChatMessage {
  const message: LiveFixChatMessage = {
    id: generateId("lfx_chat_"),
    sessionId: data.sessionId,
    author: data.author,
    authorName: data.authorName,
    content: data.content,
    createdAt: new Date().toISOString(),
  };
  liveFixChatMessages.push(message);
  return message;
}

export function getLiveFixSessionState(sessionId: string): LiveFixSessionState {
  if (!liveFixSessionStates.has(sessionId)) {
    liveFixSessionStates.set(sessionId, defaultSessionState(sessionId));
  }
  return { ...liveFixSessionStates.get(sessionId)! };
}

export function updateLiveFixSessionState(
  sessionId: string,
  patch: Partial<Omit<LiveFixSessionState, "sessionId" | "updatedAt">>,
): LiveFixSessionState {
  const current = getLiveFixSessionState(sessionId);
  const next: LiveFixSessionState = {
    ...current,
    ...patch,
    sessionId,
    updatedAt: new Date().toISOString(),
  };
  liveFixSessionStates.set(sessionId, next);
  return { ...next };
}

export function getLinkedIssuesSummary() {
  const linkedGithub = tickets.filter((t) => t.githubIssueUrl);
  const linkedJira = tickets.filter((t) => t.jiraIssueKey);
  return { linkedGithub, linkedJira };
}
